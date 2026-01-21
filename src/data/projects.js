import html from "../assets/html.png";
import css from "../assets/css.png";
import tailwind from "../assets/tailwind.png";
import react from "../assets/react.png";
import express from "../assets/express.png";
import mongodb from "../assets/mongodb.png";
import nodejs from "../assets/nodejs.png";
import zustand from "../assets/zustand.png";
import python from "../assets/python.png";
import minio from "../assets/minio.png";
import postgresql from "../assets/postgresql.png";
import metabase from "../assets/metabase.png";
import docker from "../assets/docker.png";
import threejs from "../assets/three_js.png";
import nextjs from "../assets/nextjs.png";
import prisma from "../assets/prisma.png";

import airflow from "../assets/airflow.png";
import tableau from "../assets/tableau.png";

import dahlia_family_house from "../assets/img/dahlia_family_house.png";
import double_degree from "../assets/img/double_degree.png";
import hr_dashboard from "../assets/img/hr_dashboard.png";
import touravel from "../assets/img/touravel.png";
import portfolio_v1 from "../assets/img/portfolio_v1.png";
import portfolio_v2 from "../assets/img/portfolio_v2.png";
import portfolio_v3 from "../assets/img/portfolio_v3.png";
import packing_list from "../assets/img/packing_list.png";
import log_authentication from "../assets/img/mern_log_authentication.png";
import mern_product_store_self from "../assets/img/mern_product_store_self.png";
import netflix from "../assets/img/netflix.png";
import pern_product_store from "../assets/img/pern_product-store.png";
import mern_product_store from "../assets/img/mern_product_store.png";
import sticky_wall from "../assets/img/sticky_wall.png";
import simple_portfolio from "../assets/img/simple-portfolio.png";

export const projects = [
  {
    title: "Simple Portfolio",
    tech: [html, tailwind, react],
    link: "https://github.com/Dhorq/simple-portfolio",
    description:
      "Simple portfolio website built only using React.js and TailwindCSS as tech stacks.",
    tutorial: false,
    image: simple_portfolio,
  },
  {
    title: "Inventory Management",
    tech: [html, tailwind, react, nextjs, prisma],
    link: "https://github.com/Dhorq/",
    description:
      "Inventory management website built on Next.js. Intended to improve my Next.js skill.",
    tutorial: false,
  },
  {
    title: "User Authentication MERN Stack",
    tech: [html, tailwind, react, nodejs, express, mongodb],
    link: "https://github.com/Dhorq/log-authentication-1",
    description:
      "Website to practice authentication backend by creating register, login, logout, and middleware for user",
    tutorial: false,
    image: log_authentication,
  },
  {
    title: "Sticky Wall MERN Stack",
    tech: [html, tailwind, react, nodejs, express, mongodb],
    link: "https://github.com/Dhorq/sticky-wall",
    description:
      "Website to practice MERN stack and I decided to create sticky wall / sticky notes look alike with pagination",
    tutorial: false,
    image: sticky_wall,
  },
  {
    title: "List Store MERN Stack",
    tech: [html, tailwind, react, nodejs, express, mongodb],
    link: "github.com",
    description: "Simple CRUD MERN website to store a list",
    tutorial: false,
    image: mern_product_store_self,
  },
  {
    title: "Netflix Clone",
    tech: [html, tailwind, react, nodejs, express, mongodb, zustand],
    link: "https://github.com/Dhorq/netflix-alike",
    description: "Full stack Netflix clone in MERN stack",
    tutorial: true,
    image: netflix,
  },
  {
    title: "Product Store PERN Stack",
    tech: [html, tailwind, react, nodejs, express, zustand],
    link: "https://github.com/Dhorq/pern-product-store",
    description: "Simple CRUD product store PERN stack",
    tutorial: true,
    image: pern_product_store,
  },
  {
    title: "Product Store MERN Stack",
    tech: [html, tailwind, react, nodejs, express, zustand],
    link: "https://github.com/Dhorq/mern-product-store",
    description: "Simple CRUD product store MERN stack",
    tutorial: true,
    image: mern_product_store,
  },
  {
    title: "Packing List",
    tech: [html, css, react],
    link: "https://github.com/Dhorq/packing-list",
    description:
      "Packing list frontend only application. Created to practice React.js skill",
    tutorial: false,
    image: packing_list,
  },
  {
    title: "Portfolio Website V3",
    tech: [html, tailwind, react, threejs],
    link: "https://github.com/Dhorq/3d-pf",
    description: "Portfolio website V3",
    tutorial: false,
    image: portfolio_v3,
  },
  {
    title: "Portfolio Website V2",
    tech: [html, tailwind, react],
    link: "https://github.com/Dhorq/new-pf-tailwind",
    description: "Portfolio website V2",
    tutorial: false,
    image: portfolio_v2,
  },
  {
    title: "Portfolio Website V1",
    tech: [html, css, react],
    link: "https://github.com/Dhorq/pf",
    description: "Portfolio website V1",
    tutorial: true,
    image: portfolio_v1,
  },
  {
    title: "Dahlia Family House",
    tech: [html, css, react],
    link: "https://github.com/Dhorq/dfh",
    description: "Frontend only villa responsive website",
    tutorial: true,
    image: dahlia_family_house,
  },
  {
    title: "Stock Market ETL Pipeline",
    tech: [python, airflow, minio, postgresql, metabase],
    link: "https://github.com/Dhorq/stock-market-pipeline",
    description: "Stock market ETL pipeline",
    tutorial: true,
    image: airflow,
  },
  {
    title: "APOD NASA ETL Pipeline",
    tech: [python, airflow, postgresql, docker],
    link: "https://github.com/Dhorq/apod-nasa-etl-pipeline",
    description: "APOD NASA ETL pipeline",
    tutorial: true,
    image: airflow,
  },
  {
    title: "Tableau HR Dashboard",
    tech: [tableau],
    link: "https://drive.google.com/file/d/1IfpRgBkYGBTFenBEHfmiLuuctXtHHKAU/view?usp=sharing",
    description: "HR Dashboard insight",
    tutorial: false,
    image: hr_dashboard,
  },
  {
    title: "Double Degree",
    tech: [html, css],
    link: "https://drive.google.com/file/d/1R7pCPNUDA-VQv-j9ig8ELkLor4cKBYg2/view?usp=sharing",
    description: "Website for my thesis built in HTML CSS Javascript",
    tutorial: false,
    image: double_degree,
  },
  {
    title: "Touravel",
    tech: [html, css],
    link: "https://github.com/Dhorq/travel-s",
    description: "Touravel website to practice HTML and CSS",
    tutorial: false,
    image: touravel,
  },
];
