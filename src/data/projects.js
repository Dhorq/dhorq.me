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
import vue from "../assets/vue.png";
import nuxtjs from "../assets/nuxtjs.png";
import better_auth from "../assets/better_auth.png";

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
import taskez from "../assets/img/taskez.png";
import user_management_app_next from "../assets/img/user_management_app_next.png";
import user_management_app_nuxt from "../assets/img/user_management_app_nuxt.png";
import sozboost from "../assets/img/sozboost.png";

export const projects = [
  {
    title: "SozBoost",
    tech: [html, tailwind, react, nextjs, postgresql, prisma],
    link: "https://github.com/Dhorq/sozboost",
    description:
      "SozBoost is a creator marketing marketplace connecting brands and content creators to run secure and measurable promotions or campaigns. Built with Next.js and Supabase (PostgreSQL & Auth).",
    tutorial: false,
    image:  sozboost,
  },
  {
    title: "User Management App - Next.js",
    tech: [html, tailwind, react, nextjs, postgresql, prisma, better_auth],
    link: "https://github.com/Dhorq/user-management-app-next",
    description:
      "User management application with improved authentication, featuring role-based access control and distinct permissions for each role. Built on Next.js.",
    tutorial: false,
    image: user_management_app_next,
  },
  {
    title: "User Management App - Nuxt.js",
    tech: [html, tailwind, vue, nuxtjs, postgresql, prisma, better_auth],
    link: "https://github.com/Dhorq/user-management-system-nuxt",
    description:
      "User management application with improved authentication, featuring role-based access control and distinct permissions for each role. Built on Nuxt.js.",
    tutorial: false,
    image: user_management_app_nuxt,
  },
  {
    title: "Taskez",
    tech: [html, tailwind, react, express, postgresql, prisma],
    link: "https://github.com/Dhorq/taskez",
    description:
      "Full-stack task management application built with the PERN (PostgreSQL, Express, React, Node.js) stack using TypeScript and Prisma ORM, featuring robust input validation with Zod and production-grade logging with Winston to ensure reliability, maintainability, and scalability",
    tutorial: false,
    image: taskez,
  },
  {
    title: "Simple Portfolio",
    tech: [html, tailwind, react],
    link: "https://github.com/Dhorq/simple-portfolio",
    description:
      "Simple portfolio website built with React.js and Tailwind CSS, focusing on clean design and responsive user experience",
    tutorial: false,
    image: simple_portfolio,
  },
  {
    title: "Inventory Management",
    tech: [html, tailwind, react, nextjs, prisma],
    link: "https://github.com/Dhorq/",
    description:
      "Next.js-based inventory management website created to strengthen practical experience with the framework",
    tutorial: false,
  },
  {
    title: "User Authentication MERN Stack",
    tech: [html, tailwind, react, nodejs, express, mongodb],
    link: "https://github.com/Dhorq/log-authentication-1",
    description:
      "Practice project focused on backend authentication, featuring user registration, login, logout, and middleware handling",
    tutorial: false,
    image: log_authentication,
  },
  {
    title: "Sticky Wall MERN Stack",
    tech: [html, tailwind, react, nodejs, express, mongodb],
    link: "https://github.com/Dhorq/sticky-wall",
    description:
      "MERN stack project developed to practice full-stack development, featuring a sticky notes-style interface with pagination",
    tutorial: false,
    image: sticky_wall,
  },
  {
    title: "List Store MERN Stack",
    tech: [html, tailwind, react, nodejs, express, mongodb],
    link: "github.com",
    description:
      "MERN stack application implementing basic CRUD operations to manage and store a list",
    tutorial: false,
    image: mern_product_store_self,
  },
  {
    title: "Netflix Clone",
    tech: [html, tailwind, react, nodejs, express, mongodb, zustand],
    link: "https://github.com/Dhorq/netflix-alike",
    description:
      "Full-stack Netflix clone developed using the MERN (MongoDB, Express, React, Node.js) stack",
    tutorial: true,
    image: netflix,
  },
  {
    title: "Product Store PERN Stack",
    tech: [html, tailwind, react, nodejs, express, zustand],
    link: "https://github.com/Dhorq/pern-product-store",
    description:
      "PERN stack application implementing CRUD operations for managing a product store",
    tutorial: true,
    image: pern_product_store,
  },
  {
    title: "Product Store MERN Stack",
    tech: [html, tailwind, react, nodejs, express, zustand],
    link: "https://github.com/Dhorq/mern-product-store",
    description:
      "MERN stack application implementing CRUD operations for managing a product store",
    tutorial: true,
    image: mern_product_store,
  },
  {
    title: "Packing List",
    tech: [html, css, react],
    link: "https://github.com/Dhorq/packing-list",
    description:
      "React.js frontend project for managing a packing list, created to enhance practical skills with the framework",
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
    description:
      "React.js frontend project featuring a responsive villa website design",
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
    description: "Website for my thesis, developed using HTML CSS Javascript",
    tutorial: false,
    image: double_degree,
  },
  {
    title: "Touravel",
    tech: [html, css],
    link: "https://github.com/Dhorq/travel-s",
    description:
      "Touravel website to practice HTML and CSS while doing a study in college",
    tutorial: false,
    image: touravel,
  },
];
