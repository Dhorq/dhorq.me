import html from "../assets/html.png";
import css from "../assets/css.png";
import tailwind from "../assets/tailwind.png";
import react from "../assets/react.png";
import express from "../assets/express.png";
import mongodb from "../assets/mongodb.png";
import nodejs from "../assets/nodejs.png";
import zustand from "../assets/zustand.png";

import tableau from "../assets/tableau.png";

import dahlia_family_house from "../assets/img/dahlia_family_house.png";
import double_degree from "../assets/img/double_degree.png";
import hr_dashboard from "../assets/img/hr_dashboard.png";
import touravel from "../assets/img/touravel.png";
import portfolio_v1 from "../assets/img/portfolio_v1.png";
import portfolio_v2 from "../assets/img/portfolio_v2.png";
import packing_list from "../assets/img/packing_list.png";

import airflow from "../assets/airflow.png";

export const projects = [
  {
    title: "User Authentication MERN Stack",
    tech: [html, tailwind, react, nodejs, express, mongodb],
    link: "github.com",
    description:
      "Website to practice authentication backend by creating register, login, logout, and middleware for user",
    tutorial: false,
  },
  {
    title: "List Store MERN Stack",
    tech: [html, tailwind, react, nodejs, express, mongodb],
    link: "github.com",
    description: "Simple CRUD MERN website to store a list",
    tutorial: false,
  },
  {
    title: "Netflix Clone",
    tech: [html, tailwind, react, nodejs, express, mongodb, zustand],
    link: "github.com",
    description: "Full stack Netflix clone in MERN stack",
    tutorial: true,
  },
  {
    title: "Product Store PERN Stack",
    tech: ["React", "Tailwind"],
    link: "github.com",
    description: "Simple CRUD product store PERN stack",
    tutorial: true,
  },
  {
    title: "Product Store MERN Stack",
    tech: ["React", "Tailwind"],
    link: "github.com",
    description: "Simple CRUD product store MERN stack",
    tutorial: true,
  },
  {
    title: "Packing List",
    tech: ["React", "Tailwind"],
    link: "github.com",
    description:
      "Packing list frontend only application. Created to practice React.js skill",
    tutorial: false,
    image: packing_list,
  },
  {
    title: "Portfolio Website V3",
    tech: ["React", "Tailwind"],
    link: "github.com",
    description: "Portfolio website V3",
    tutorial: false,
  },
  {
    title: "Portfolio Website V2",
    tech: ["React", "Tailwind"],
    link: "github.com",
    description: "Portfolio website V2",
    tutorial: false,
    image: portfolio_v2,
  },
  {
    title: "Portfolio Website V1",
    tech: ["React", "Tailwind"],
    link: "github.com",
    description: "Portfolio website V1",
    tutorial: true,
    image: portfolio_v1,
  },
  {
    title: "Dahlia Family House",
    tech: ["React", "Tailwind"],
    link: "github.com",
    description: "Frontend only villa responsive website",
    tutorial: true,
    image: dahlia_family_house,
  },
  {
    title: "Stock Market ETL Pipeline",
    tech: ["React", "Tailwind"],
    link: "github.com",
    description: "Stock market ETL pipeline",
    tutorial: true,
    image: airflow,
  },
  {
    title: "APOD NASA ETL Pipeline",
    tech: ["React", "Tailwind"],
    link: "github.com",
    description: "APOD NASA ETL pipeline",
    tutorial: true,
    image: airflow,
  },
  {
    title: "Tableau HR Dashboard",
    tech: [tableau],
    link: "github.com",
    description: "HR Dashboard insight",
    tutorial: false,
    image: hr_dashboard,
  },
  {
    title: "Double Degree",
    tech: [html, css],
    link: "github.com",
    description: "Website for my thesis built in HTML CSS Javascript",
    tutorial: false,
    image: double_degree,
  },
  {
    title: "Touravel",
    tech: [html, css],
    link: "github.com",
    description: "Touravel website to practice HTML and CSS",
    tutorial: false,
    image: touravel,
  },
];
