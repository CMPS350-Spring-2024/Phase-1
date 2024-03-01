#!/usr/bin/env node

//	Import packages
import { filesize } from 'filesize';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

//	Declare constants
const BUDGET = 1000 * 1000; // 1MB
const BUDGET_PERCENT_INCREASE_RED = 80;
const BUDGET_PERCENT_INCREASE_YELLOW = 40;
const README_PATH = path.join(process.cwd(), 'README.md');
const BUNDLE_DATA_PATH = path.join(process.cwd(), '/dist/stats.json');

/* ---------------------------- Utility Functions --------------------------- */

/**
 * Converts the given number of bytes to kilobytes
 */
const toKB = (bytes, options) => {
	//	Run the original function but replace the spacer used
	return filesize(bytes, {
		bits: false,
		spacer: ' ',
		...options,
	});
};

/**
 * Given the percentage of the size budget used, renders a colored status indicator
 *
 * In general:
 * - 🔴 means "_this is a problem_"
 * - 🟡 means "_keep an eye on this_"
 * - 🟢 means "_bundle sizes are optimal_"
 */
const generateIndicator = (percent) => {
	//	If the percent is greater than the red threshold, return the red indicator
	if (percent >= BUDGET_PERCENT_INCREASE_RED) return '🔴';

	//	If the percent is greather than the yellow threshold, return the red indicator
	if (percent >= BUDGET_PERCENT_INCREASE_YELLOW) return '🟡';

	//	If the percent is less than all the thresholds, return the green indicator
	return '🟢';
};

/**
 * Prepares the readme for the bundle analysis report by removing content
 * between placeholder comments
 */
const prepareReadme = () => {
	//	Import the readme file
	const readme = readFileSync(README_PATH);

	//	Import the readme file as a string and remove all content between placeholder comments
	return readme
		.toString()
		.replace(
			/<!-- BUNDLE_TABLE_START -->[\s\S]*?<!-- BUNDLE_TABLE_END -->/g,
			'<!-- BUNDLE_TABLE_START -->\n<!-- BUNDLE_TABLE_END -->',
		);
};

/**
 * Extracts the bundle size data from the __bundle_analysis.json file.
 */
const extractBundleData = () => {
	//	Import bundle data
	const bundle = JSON.parse(readFileSync(BUNDLE_DATA_PATH));

	//	Extract bundle size data and format it
	const totalBundle = bundle.reduce((acc, curr) => acc + curr.gzipSize, 0);

	//	Go through each page in the final bundle and analyze it
	const bundleData = [totalBundle];

	//	Return the global bundle and page data
	return bundleData;
};

/**
 * Generates the table for the bundle analysis report.
 *
 * @param {string} readme		The readme file contents.
 * @param {object} bundleData	The bundle size data.
 */
const generateTable = (readme, bundleData) => {
	//	Declare string used to hold the final table formatting
	let finalTable = '';

	//	Add table headers
	const budgetKB = toKB(BUDGET);
	finalTable += `| | Size | Budget Used (\`${budgetKB}\`) | \n`;
	finalTable += '| --- | :---: | :---: | \n';

	//	Add global bundle data
	const totalGzip = bundleData[0];
	const totalKB = toKB(totalGzip);
	const totalPercent = (totalGzip / BUDGET) * 100;
	const totalIndicator = generateIndicator(totalPercent);
	const totalBudgetPercentage = `${totalIndicator} \`${totalPercent.toFixed(2)}%\``;
	finalTable += `| \`total\` | \`${totalKB}\` | ${totalBudgetPercentage} | \n`;

	//	Add final table string to the readme
	return readme.replace(
		'<!-- BUNDLE_TABLE_START -->\n<!-- BUNDLE_TABLE_END -->',
		`<!-- BUNDLE_TABLE_START -->\n${finalTable}\n<!-- BUNDLE_TABLE_END -->`,
	);
};

//	Prepare readme
console.log('Preparing readme...');
const preparedReadme = prepareReadme();

//	Extract bundle size data
console.log('Extracting bundle data...');
const bundleData = extractBundleData();

//	Generate table and insert it into the new readme
console.log('Generating markdown table...');
const newReadme = generateTable(preparedReadme, bundleData);

//	Replace the existing readme with the new one
console.log('Writing bundle report to README...');
writeFileSync(README_PATH, newReadme);
