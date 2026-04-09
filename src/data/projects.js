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
import golang from "../assets/golang.png"
import gorm from "../assets/gorm.png"
import gin from "../assets/gin.png"

import airflow from "../assets/airflow.png";
import tableau from "../assets/tableau.png";

import dahlia_family_house from "../assets/img/dahlia_family_house.png";
import hr_dashboard from "../assets/img/hr_dashboard.png";
import portfolio_v1 from "../assets/img/portfolio_v1.png";
import portfolio_v2 from "../assets/img/portfolio_v2.png";
import portfolio_v3 from "../assets/img/portfolio_v3.png";
import packing_list from "../assets/img/packing_list.png";
import netflix from "../assets/img/netflix.png";
import simple_portfolio from "../assets/img/simple-portfolio.png";
import taskez from "../assets/img/taskez.png";
import user_management_app_next from "../assets/img/user_management_app_next.png";
import user_management_app_nuxt from "../assets/img/user_management_app_nuxt.png";
import sozboost from "../assets/img/sozboost.png";
import tasq from "../assets/img/Tasq.jpeg"

export const projects = [
  {
    title: "Tasq.",
    tech: [html, tailwind, react, docker, postgresql, golang, gorm,gin],
    link: "https://github.com/Dhorq/tasq",
    website: null,
    description:
      "Tasq is a task management application that helps users organize their tasks, including projects and workspaces. It is built using React, Golang (Gin Gonic), Docker, and PostgreSQL.",
    tutorial: false,
    image:  tasq,
  },
  {
    title: "SozBoost",
    tech: [html, tailwind, react, nextjs, postgresql, prisma],
    link: "https://github.com/Dhorq/sozboost",
    website: null,
    description:
      "SozBoost is a creator marketing marketplace connecting brands and content creators to run secure and measurable promotions or campaigns. Built with Next.js and Supabase (PostgreSQL & Auth).",
    tutorial: false,
    image:  sozboost,
  },
  {
    title: "User Management App - Next.js",
    tech: [html, tailwind, react, nextjs, postgresql, prisma, better_auth],
    link: "https://github.com/Dhorq/user-management-app-next",
    website: null,
    description:
      "User management application with improved authentication, featuring role-based access control and distinct permissions for each role. Built on Next.js.",
    tutorial: false,
    image: user_management_app_next,
  },
  {
    title: "User Management App - Nuxt.js",
    tech: [html, tailwind, vue, nuxtjs, postgresql, prisma, better_auth],
    link: "https://github.com/Dhorq/user-management-system-nuxt",
    website: null,
    description:
      "User management application with improved authentication, featuring role-based access control and distinct permissions for each role. Built on Nuxt.js.",
    tutorial: false,
    image: user_management_app_nuxt,
  },
  {
    title: "Taskez",
    tech: [html, tailwind, react, express, postgresql, prisma],
    link: "https://github.com/Dhorq/taskez",
    website: null,
    description:
      "Full-stack task management application built with the PERN (PostgreSQL, Express, React, Node.js) stack using TypeScript and Prisma ORM, featuring robust input validation with Zod and production-grade logging with Winston to ensure reliability, maintainability, and scalability",
    tutorial: false,
    image: taskez,
  },
  {
    title: "Simple Portfolio",
    tech: [html, tailwind, react],
    link: "https://github.com/Dhorq/simple-portfolio",
    website: null,
    description:
      "Simple portfolio website built with React.js and Tailwind CSS, focusing on clean design and responsive user experience and refreshing frontend skills.",
    tutorial: false,
    image: simple_portfolio,
  },
  {
    title: "Netflix Clone",
    tech: [html, tailwind, react, nodejs, express, mongodb, zustand],
    link: "https://github.com/Dhorq/netflix-alike",
    website: null,
    description:
      "Full-stack Netflix clone developed using the MERN (MongoDB, Express, React, Node.js) stack",
    tutorial: true,
    image: netflix,
  },
  {
    title: "Packing List",
    tech: [html, css, react],
    link: "https://github.com/Dhorq/packing-list",
    website: "https://whimsical-kelpie-a68cc0.netlify.app/",
    description:
      "React.js frontend project for managing a packing list, created to enhance practical skills with the framework",
    tutorial: false,
    image: packing_list,
  },
  {
    title: "Portfolio Website V3",
    tech: [html, tailwind, react, threejs],
    link: "https://github.com/Dhorq/3d-pf",
    website: "https://dhorq.vercel.app/",
    description: "Portfolio website V3",
    tutorial: false,
    image: portfolio_v3,
  },
  {
    title: "Portfolio Website V2",
    tech: [html, tailwind, react],
    link: "https://github.com/Dhorq/new-pf-tailwind",
    website: "https://new-pf-eight.vercel.app/",
    description: "Portfolio website V2",
    tutorial: false,
    image: portfolio_v2,
  },
  {
    title: "Portfolio Website V1",
    tech: [html, css, react],
    link: "https://github.com/Dhorq/pf",
    website: "https://portfolio-ridho-six.vercel.app/",
    description: "Portfolio website V1",
    tutorial: true,
    image: portfolio_v1,
  },
  {
    title: "Dahlia Family House",
    tech: [html, css, react],
    link: "https://github.com/Dhorq/dfh",
    website: "https://dahliafamilyhouse.com/",
    description:
      "React.js frontend project featuring a responsive villa website design",
    tutorial: true,
    image: dahlia_family_house,
  },
  {
    title: "Stock Market ETL Pipeline",
    tech: [python, airflow, minio, postgresql, metabase],
    link: "https://github.com/Dhorq/stock-market-pipeline",
    website: null,
    description: "Stock market ETL pipeline",
    tutorial: true,
    image: airflow,
  },
  {
    title: "APOD NASA ETL Pipeline",
    tech: [python, airflow, postgresql, docker],
    link: "https://github.com/Dhorq/apod-nasa-etl-pipeline",
    website: null,
    description: "APOD NASA ETL pipeline",
    tutorial: true,
    image: airflow,
  },
  {
    title: "Tableau HR Dashboard",
    tech: [tableau],
    link: "https://drive.google.com/file/d/1IfpRgBkYGBTFenBEHfmiLuuctXtHHKAU/view?usp=sharing",
    website: null,
    description: "HR Dashboard insight",
    tutorial: false,
    image: hr_dashboard,
  },
];
