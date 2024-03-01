<div align="center">
    <img margin="auto" src="./public/images/cover-photo.png" alt="DJI drone marketplace cover photo showing the home page"/>
</div>

<br/>

<div align="center">
    <!-- TODO: update version number on every release -->
    <img alt="Version number" src="https://img.shields.io/badge/version-v0.1.0-blue"/>
    <img alt="Project license" src="https://img.shields.io/badge/license-MIT-green"/>
</div>

<div align="center">
    <img alt="Deploying workflow status" src="https://github.com/CMPS350-Spring-2024/Phase-1/actions/workflows/deploying.yml/badge.svg"/>
    <img alt="Generating workflow status" src="https://github.com/CMPS350-Spring-2024/Phase-1/actions/workflows/generating.yml/badge.svg"/>
    <img alt="Linting workflow status" src="https://github.com/CMPS350-Spring-2024/Phase-1/actions/workflows/linting.yml/badge.svg"/>
</div>

<br/>

<span align="center">
    <h1><b>DJI Drone Marketplace</b><br/>
    Project Phase 1</h1>

**DJI Drone Marketplace** is an interactive web application that allows users to buy and sell drones. Users can browse
through a variety of drones, view their features and specifications, and place orders. The application also provides a
platform both buyers and sellers to manage their accounts, view their transaction history, and track their orders.

**This project is done as part of the CMPS350 course project under Qatar University.**

</span>

## 🔑 Key Features

-   **User Authentication**: Users can sign up, log in, and log out of their accounts. They can also reset their
    passwords if they forget them.
-   **Drone Listings**: Users can view a list of drones available for purchase in **3D**. They can view details on each
    drone such as its price, features, whats in the box, reviews, and more.
-   **Order Management**: Users can place orders for drones and track their order status. They can also view their order
    history.
-   **Account Management**: Users can view and edit their account details, such as their name, email, and password.
-   **Seller Dashboard**: Sellers can view and manage their drone listings, orders, and account details.

## 📖 Table of Contents

-   [💻 Getting Started](#-getting-started)
-   [📦 Bundle Size](#-bundle-size)
-   [📚 Tech Stack](#-tech-stack)
-   [🧩 Components](#-components)

## 💻 Getting Started

First, make sure you have the following installed on your machine:

-   [Node.js](https://nodejs.org/en/download/)
-   [VSCode](https://code.visualstudio.com/download)

And if not already installed, run the following command to globally install `pnpm`:

```shell
npm install -g pnpm
```

Next, pull the repository and install the dependencies by opening the folder in VSCode and running the following
commands:

```shell
pnpm install
```

Once all the dependencies have been installed, start the application by running:

```shell
pnpm dev
```

This will open up the website for local viewing on [localhost:5173](http://localhost:5173/).

If you'd like to build and preview the production version of the application, run the following commands:

```shell
pnpm build
pnpm preview
```

## 📦 Bundle Size

The below table shows the total bundle size of the application, broken down into the different routes. Each row
represents a route which has a colored indicator showing the performance of that particular route.

<!-- BUNDLE_TABLE_START -->
| | Size | Budget Used (`1 MB`) | 
| --- | :---: | :---: | 
| `total` | `332.88 kB` | 🟢 `33.29%` | 

<!-- BUNDLE_TABLE_END -->

## 📚 Tech Stack

-   **Vite** - Builds and compiles the application, and provides hot module replacement and fast refresh during
    development. Used in particular to simplify tailwindcss, postcss, posthtml, and multi-page routing configuration
-   **TailwindCSS** - A utility-first CSS framework that provides a set of pre-built classes to help build custom
    designs. This was used to reduce some of the headaches involved in writing vanilla CSS and to allow for the use of
    pre-built component libraries.
-   **PrelineUI** - A component library built on top of TailwindCSS that provides a complete set of pre-built components
    and styles to help build custom designs.
-   **Three.js** - A 3D library that provides a set of tools to create and render 3D scenes in the browser. This was
    used to render 3D models of drones in the application.

## 🧩 Components

The components used in this application are built using the new Web Components API. This allows for the creation of
custom native-elements that are simpler and more performant than traditional frameworks like React or Vue. We also had
to use them due to the limitations set for the course project.

Each component extends a base class `BaseComponent.ts` that provides a set of lifecycle methods and properties to help
manage the component's state and behavior. For components that are extensions of the primitive HTML elements such as
`button`, `input`, etc..., we further extend the `PrimitiveComponent.ts` class which forwards some attributes to the
native element encapsulated within the component.

```html
<!-- Changing the custom attribute will reflect the change in the button element -->
<custom-button-element custom-attribute="test">
	<button custom-attribute="test">
		<slot>
	</button>
</custom-button-element>
```

Within the component folder there are 3 main files:

-   `logic.ts` - Contains the logic for the component, such as event listeners, state management, and other methods.
    Also specifies which attributes should be observed and reflected to the native element.
-   `style.css` - Contains the styles for the component. These styles are automatically imported into the main
    stylesheet in the `@components` layer. This fixes the issue of style precedence and allows for the use of tailwind
    utility classes.
-   `template.html` - Contains the HTML template for the component. This is the structure of the component and will be
    rendered in the DOM during runtime.
