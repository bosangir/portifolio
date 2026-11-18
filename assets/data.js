/* Content for the portfolio. Edit here to update the site. */
window.PORTFOLIO = {
  typed: [
    "library(SUMO); simulate_multiomics(n_factors = 4)",
    "survfit(Surv(time, event) ~ arm, data = trial)",
    "glmer(seroconv ~ visit * arm + (1 | site), family = binomial)",
    "svymean(~vaccinated, design = cluster_design)",
    "proc mixed data=adam.adlb; class usubjid visit;",
    "mabc(list(rna, methyl, protein), k = 3)",
    "brm(cases ~ arm, family = binomial, prior = prior)"
  ],

  angles: [
    {
      id: "trials", title: "Clinical trials",
      lead: "Randomised trials from protocol to final report.",
      body: "Sample-size calculations, statistical analysis plans, randomisation, interim and DSMB reports, and final analyses. I've worked on a phase II Ebola vaccine trial in the DRC, HIV-prevention studies in Kenya, and now serve on a Data and Safety Monitoring Board for a DNDi trial.",
      points: ["SAPs & DSMB reports", "Mixed models for repeated measures", "Immunogenicity & safety", "CDISC-style datasets"],
      tools: ["R", "SAS", "REDCap", "lme4"]
    },
    {
      id: "vaccines", title: "Vaccine epidemiology",
      lead: "Immunogenicity, seroprevalence and vaccine effectiveness.",
      body: "Analyses of antibody responses, booster timing, seroprevalence in health-care workers and vaccine effectiveness. Co-author of trial results in The Lancet Infectious Diseases and The Journal of Infectious Diseases.",
      points: ["Geometric mean concentrations", "Booster comparisons", "Seroprevalence", "Vaccine effectiveness"],
      tools: ["R", "SAS", "Stata-style workflows"]
    },
    {
      id: "surveys", title: "Survey statistics",
      lead: "Coverage surveys that hold up to scrutiny.",
      body: "Complex sample designs, weighting, design effects and coverage estimation for vaccination coverage surveys, including WHO VCQI-style indicators. I build pipelines that check data consistency, de-identify records and produce reproducible coverage tables.",
      points: ["Cluster & stratified designs", "Weights & design effects", "Card vs recall evidence", "Data-quality listings"],
      tools: ["R survey", "vcqiR", "SurveyCTO", "ODK"]
    },
    {
      id: "omics", title: "Bioinformatics & multi-omics",
      lead: "Integrating many data layers into one picture.",
      body: "My PhD develops methods to integrate transcriptomics, methylation, proteomics and other omics layers: latent-factor models, integrative and ensemble clustering, and biclustering under weak or heterogeneous signals.",
      points: ["Factor analysis & MOFA-type models", "Ensemble clustering (M-ABC)", "Biclustering", "Simulation (SUMO)"],
      tools: ["R", "Bioconductor", "Rcpp", "HPC"]
    },
    {
      id: "ml", title: "Machine learning & AI",
      lead: "Prediction and pattern-finding, with interpretation.",
      body: "Supervised and unsupervised learning for health data, model evaluation and benchmarking, explainable AI and fairness, plus LLM and retrieval-augmented tools for research workflows.",
      points: ["Penalised regression & trees", "Clustering & dimension reduction", "Explainability (XAI)", "LLM & RAG pipelines"],
      tools: ["R", "Python", "scikit-learn", "Hugging Face"]
    },
    {
      id: "longitudinal", title: "Longitudinal & survival",
      lead: "Data that unfold over time.",
      body: "Mixed-effects and GEE models for repeated measures, survival and time-to-event analysis, hidden Markov and finite mixture models, and Bayesian hierarchical models.",
      points: ["Linear & generalised mixed models", "Kaplan–Meier & Cox", "Bayesian hierarchical models", "Missing data & MI"],
      tools: ["R", "SAS", "OpenBUGS", "Stan"]
    },
    {
      id: "data", title: "Research data management",
      lead: "The systems behind trustworthy results.",
      body: "Database design, electronic data capture, validation rules, query management, data cleaning and secure, de-identified data sharing for trials and cohorts in Kenya and the DRC.",
      points: ["eCRF design in REDCap & ODK", "Edit checks & query logs", "De-identification & GDPR", "Data management plans"],
      tools: ["REDCap", "ODK", "SQL", "Git"]
    },
    {
      id: "viz", title: "Visualisation & dashboards",
      lead: "Results that people can read and use.",
      body: "Publication figures, interactive Shiny apps and programme dashboards that turn analyses into decisions, plus spatial maps for public-health questions.",
      points: ["ggplot2 publication figures", "Shiny dashboards", "Power BI & Tableau", "Spatial epidemiology"],
      tools: ["ggplot2", "Shiny", "Power BI", "QGIS"]
    }
  ],

  timeline: [
    {
      when: "Aug 2025 – now", role: "Co-founder & Biostatistician", org: "Neudata Consulting Ltd · neu-data.com",
      tags: ["Co-founder", "DSMB", "Clinical trials", "Training"],
      details: ["Co-founded a consultancy for biostatistics, data science, research data management and training", "Member of the Data and Safety Monitoring Board for a DNDi (Drugs for Neglected Diseases initiative) trial in the DRC", "Statistical support for clinical and public-health studies, from design and sample size to final reports", "Course development in clinical research, statistical inference and scientific communication"]
    },
    {
      when: "Aug 2023 – now", role: "PhD Researcher, Biostatistics & Statistical Bioinformatics", org: "SCK CEN & Hasselt University, Belgium",
      tags: ["Multi-omics", "R software", "Methods"],
      details: ["Statistical methods and software for integrating big bio-molecular data", "Developed SUMO (Bioinformatics Advances, 2025) and M-ABC", "Benchmarking unsupervised factor-analysis methods for multi-omics integration"]
    },
    {
      when: "Aug 2020 – now", role: "Teaching Assistant", org: "Hasselt University & University of Antwerp",
      tags: ["R", "Data management", "Teaching"],
      details: ["R programming for the Master of Statistics and Data Science (Hasselt)", "Data management and statistical software for the Master of Epidemiology (Antwerp)", "Epidemiology, Biostatistics & Qualitative Research Methods summer course"]
    },
    {
      when: "Sep 2020 – Aug 2023", role: "Biostatistician & Data Manager", org: "University of Antwerp · CEV & Global Health Institute",
      tags: ["Ebola vaccine", "Phase II RCT", "DRC"],
      details: ["Biostatistics and data management for EBOVAC, a randomised phase II trial of a heterologous Ebola vaccine regimen in DRC health-care providers", "Immunogenicity, safety and booster analyses published in The Lancet Infectious Diseases and The Journal of Infectious Diseases", "Seroprevalence, trial-understanding and iris-scanning identification studies"]
    },
    {
      when: "Oct 2017 – Aug 2018", role: "Statistician & Data Manager", org: "KEMRI – University of Washington, Thika, Kenya",
      tags: ["HIV prevention", "PrEP", "Cohorts"],
      details: ["SCIP: mHealth safer-conception intervention for serodiscordant couples", "JiPime-JiPrEP: HIV self-testing for efficient PrEP delivery; MPYA: PrEP in young women", "NuvaRing, GHS (HSV-2 inception cohort), Merck III (HPV vaccine immunogenicity to 48 months) and the Partners Demonstration Project"]
    },
    {
      when: "Feb 2017 – Sep 2017", role: "Data Management Specialist", org: "PACT Endeleza · University of Maryland, Baltimore (Nairobi)",
      tags: ["HIV programme", "M&E"],
      details: ["Data systems for a comprehensive HIV prevention and treatment programme", "Routine reporting, data-quality audits and programme dashboards"]
    },
    {
      when: "Sep 2015 – Jan 2017", role: "Research Assistant", org: "KEMRI – University of Washington, Thika, Kenya",
      tags: ["Data collection", "REDCap", "ODK"],
      details: ["Electronic data capture and data cleaning for HIV-prevention research", "Trained in research data management with REDCap and ODK (University of Washington)"]
    },
    {
      when: "Sep 2014 – Dec 2014", role: "Junior Statistician (Intern)", org: "Ministry of Agriculture, Livestock & Fisheries, Kenya",
      tags: ["Official statistics"],
      details: ["Central Planning and Project Monitoring Unit: project monitoring data and summary statistics"]
    }
  ],

  pubs: [
    { y: 2026, area: "Methods", status: "Under review", title: "Multi-data learning with M-ABC: an extension of the ABC method for joint clustering of multi-source datasets", venue: "Under review", authors: "Osang'ir BI, Gupta S, Shkedy Z, Claesen J, Cabrera J, Amaratunga D, et al." },
    { y: 2026, area: "Methods", status: "Under review", title: "Benchmarking unsupervised factor analysis methods for multi-omics integration", venue: "Under review", authors: "Osang'ir BI, Gupta S, Shkedy Z, Claesen J, Benotmane R, Mysara M." },
    { y: 2025, area: "Methods", title: "SUMO: an R package for simulating multi-omics data for methods development and testing", venue: "Bioinformatics Advances", authors: "Osang'ir BI, Gupta S, Shkedy Z, Claesen J." },
    { y: 2025, area: "Vaccines", title: "Long-term experiences of health care providers using iris scanning as an identification tool in a vaccine trial in the DRC: qualitative study", venue: "JMIR Formative Research", authors: "Zola Matuvanga T, Paviotti A, Bikioli Bolombo F, Lemey G, Larivière Y, Salloum M, Osang'ir BI, et al." },
    { y: 2024, area: "Vaccines", title: "Ad26.ZEBOV, MVA-BN-Filo Ebola vaccine regimen plus Ad26.ZEBOV booster at 1 year versus 2 years in health-care and front-line workers in the DRC: secondary and exploratory outcomes of an open-label, randomised, phase 2 trial", venue: "The Lancet Infectious Diseases", authors: "Larivière Y, Zola Matuvanga T, Osang'ir BI, et al." },
    { y: 2024, area: "Global health", title: "An ancillary care policy in a vaccine trial conducted in a resource-constrained setting: evaluation and policy recommendations", venue: "BMJ Global Health", authors: "Lemey G, Larivière Y, Osang'ir BI, et al." },
    { y: 2023, area: "Vaccines", title: "Safety and immunogenicity of the heterologous 2-dose Ad26.ZEBOV, MVA-BN-Filo vaccine regimen in health care providers and frontliners of the DRC", venue: "The Journal of Infectious Diseases", authors: "Larivière Y, Garcia-Fogeda I, Zola Matuvanga T, Osang'ir BI, et al." },
    { y: 2023, area: "Vaccines", title: "Low seroprevalence of Ebola virus in health care providers in an endemic region (Tshuapa province) of the DRC", venue: "PLOS ONE 18(9): e0286479", authors: "Zola Matuvanga T, Mariën J, Larivière Y, Osang'ir BI, et al." },
    { y: 2023, area: "Vaccines", title: "Longitudinal assessment of an Ebola vaccine trial understanding among healthcare providers in the DRC", venue: "Vaccine", authors: "Zola Matuvanga T, Larivière Y, Lemey G, Osang'ir BI, et al." },
    { y: 2023, area: "Global health", title: "Conducting an Ebola vaccine trial in a remote area of the DRC: challenges, mitigations, and lessons learned", venue: "Vaccine 41(51): 7587–7597", authors: "Larivière Y, Zola Matuvanga T, Lemey G, Osang'ir BI, et al." },
    { y: 2019, area: "HIV & SRH", title: "Acceptance of contraceptive vaginal ring among women with bacterial vaginosis and their male partners in Kenya (P334)", venue: "Sexually Transmitted Infections 95:A175", authors: "Ngure K, Heller K, Osang'ir I, Irungu E, et al." },
    { y: 2018, area: "HIV & SRH", title: "Contraception use and pregnancy incidence in young African women using PrEP", venue: "AIDS 2018, Abstract P07.09", authors: "Micheni M, Pyra M, Osangir I, Ngure K, Mugo N, Bukusi E, Haberer J, Baeten J." }
  ],

  radar: [
    { k: "Biostatistics", v: 9.5 },
    { k: "Clinical trials", v: 9 },
    { k: "Data management", v: 9.5 },
    { k: "R & software", v: 9.5 },
    { k: "Bioinformatics", v: 8.5 },
    { k: "Machine learning", v: 8 },
    { k: "AI & LLMs", v: 7.5 },
    { k: "Cloud & data pipelines", v: 7 }
  ],

  ai: [
    { title: "Machine learning for health", items: ["Supervised & unsupervised learning", "Model evaluation & interpretability", "AutoML: H2O.ai, Google AutoML, DataRobot"] },
    { title: "Responsible AI", items: ["Explainable AI (XAI)", "Fairness in machine learning", "Differential privacy & anonymisation", "Synthetic data for privacy-preserving simulation"] },
    { title: "LLMs & agentic AI", items: ["Transformers & LLMs for biomedical data", "Retrieval-augmented generation for health knowledge", "LangChain & LLM orchestration", "Agentic AI & human–AI collaboration", "OpenAI API & Hugging Face for research automation"] },
    { title: "Cloud & data engineering", items: ["AWS, Google Cloud & Azure for health data", "BigQuery & Snowflake warehousing", "Airflow / Prefect orchestration", "dbt & ETL pipelines", "Docker & GitHub for reproducibility"] },
    { title: "Health data standards", items: ["FHIR / HL7 interoperability", "OMOP Common Data Model (OHDSI)", "Real-world data & evidence", "GCP & human-subjects protection", "GDPR & HIPAA compliance"] },
    { title: "Spatial, M&E & dashboards", items: ["Spatial epidemiology in R (sf, tmap, spdep)", "QGIS / ArcGIS Pro", "M&E and implementation research (MEASURE Evaluation)", "Shiny, Dash, Streamlit, Power BI, Tableau, Grafana"] }
  ]
};
