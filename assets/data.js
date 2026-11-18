/* Content for the portfolio. Edit here to update the site. */
window.PORTFOLIO = {
  areas: [
    {
      title: "Clinical trials",
      lead: "Randomised trials from protocol to final report.",
      body: "I write sample-size calculations and statistical analysis plans, prepare randomisation, interim and DSMB reports, and run final analyses. I worked on a phase II Ebola vaccine trial in the DRC and on HIV-prevention studies in Kenya, and I now sit on the Data and Safety Monitoring Board of a DNDi trial.",
      points: ["Statistical analysis plans and DSMB reports", "Mixed models for repeated measures", "Immunogenicity and safety analyses", "Analysis datasets and validation"],
      tools: "R, SAS, REDCap"
    },
    {
      title: "Vaccine epidemiology",
      lead: "Immunogenicity, seroprevalence and vaccine effectiveness.",
      body: "I analyse antibody responses, booster timing, seroprevalence among health-care workers and vaccine effectiveness. I am a co-author of trial results in The Lancet Infectious Diseases and The Journal of Infectious Diseases.",
      points: ["Geometric mean concentrations", "Booster comparisons", "Seroprevalence studies", "Vaccine effectiveness"],
      tools: "R, SAS"
    },
    {
      title: "Survey statistics",
      lead: "Coverage surveys with defensible estimates.",
      body: "I work with cluster and stratified designs, survey weights and design effects to estimate vaccination coverage, including WHO VCQI indicators. My pipelines check data consistency, de-identify records and produce reproducible coverage tables.",
      points: ["Cluster and stratified designs", "Weights and design effects", "Card and recall evidence", "Data-quality listings"],
      tools: "R survey, vcqiR, SurveyCTO, ODK"
    },
    {
      title: "Bioinformatics and multi-omics",
      lead: "Combining several molecular data layers.",
      body: "My PhD develops methods to integrate transcriptomics, methylation, proteomics and other omics data. The work covers latent-factor models, integrative and ensemble clustering, and biclustering when signals are weak or uneven.",
      points: ["Factor analysis for multi-omics", "Ensemble clustering (M-ABC)", "Biclustering", "Simulation of omics data (SUMO)"],
      tools: "R, Bioconductor, Rcpp, high-performance computing"
    },
    {
      title: "Machine learning",
      lead: "Prediction and pattern finding that can be explained.",
      body: "I use supervised and unsupervised learning on health data, with attention to validation, benchmarking, interpretability and fairness. I also use language-model and retrieval tools to support research workflows.",
      points: ["Penalised regression and tree models", "Clustering and dimension reduction", "Model validation and benchmarking", "Interpretable machine learning"],
      tools: "R, Python, scikit-learn"
    },
    {
      title: "Longitudinal and survival data",
      lead: "Outcomes measured over time.",
      body: "I fit mixed-effects and GEE models for repeated measures, survival and time-to-event models, hidden Markov and finite mixture models, and Bayesian hierarchical models.",
      points: ["Linear and generalised mixed models", "Kaplan–Meier and Cox models", "Bayesian hierarchical models", "Missing data and multiple imputation"],
      tools: "R, SAS, OpenBUGS, Stan"
    },
    {
      title: "Research data management",
      lead: "Data systems that results can rely on.",
      body: "I design databases and electronic case report forms, write validation rules, manage queries, clean data and prepare de-identified datasets for sharing. I have done this for trials and cohorts in Kenya and the DRC.",
      points: ["eCRF design in REDCap and ODK", "Edit checks and query logs", "De-identification and GDPR", "Data management plans"],
      tools: "REDCap, ODK, SQL, Git"
    },
    {
      title: "Visualisation and dashboards",
      lead: "Results that readers can use.",
      body: "I prepare figures for publication, interactive Shiny applications and programme dashboards, and maps for public-health questions.",
      points: ["Publication figures in ggplot2", "Shiny applications", "Power BI and Tableau", "Spatial epidemiology"],
      tools: "ggplot2, Shiny, Power BI, QGIS"
    }
  ],

  timeline: [
    {
      when: "Aug 2025 – present", role: "Co-founder and Biostatistician", org: "Neudata Consulting Ltd",
      tags: "Consulting, clinical trials, training",
      details: [
        "Co-founded a consultancy for biostatistics, data science, research data management and training",
        "Member of the Data and Safety Monitoring Board for a DNDi (Drugs for Neglected Diseases initiative) trial in the DRC",
        "Statistical support for clinical and public-health studies, from design and sample size to final reports",
        "Course development in clinical research, statistical inference and scientific communication"
      ],
      link: { href: "https://www.neu-data.com", text: "neu-data.com" }
    },
    {
      when: "Aug 2023 – present", role: "PhD Researcher, Biostatistics and Statistical Bioinformatics", org: "SCK CEN and Hasselt University, Belgium",
      tags: "Multi-omics, R software, methods",
      details: ["Statistical methods and software for integrating large molecular datasets", "Developed SUMO (Bioinformatics Advances, 2025) and M-ABC", "Benchmark of unsupervised factor-analysis methods for multi-omics integration"]
    },
    {
      when: "Aug 2020 – present", role: "Teaching Assistant", org: "Hasselt University and University of Antwerp",
      tags: "R, data management, teaching",
      details: ["R programming for the Master of Statistics and Data Science (Hasselt)", "Data management and statistical software for the Master of Epidemiology (Antwerp)", "Epidemiology, Biostatistics and Qualitative Research Methods summer course"]
    },
    {
      when: "Sep 2020 – Aug 2023", role: "Biostatistician and Data Manager", org: "University of Antwerp, CEV and Global Health Institute",
      tags: "Ebola vaccine, phase II trial, DRC",
      details: ["Biostatistics and data management for EBOVAC, a randomised phase II trial of a heterologous Ebola vaccine regimen in health-care providers in the DRC", "Immunogenicity, safety and booster analyses published in The Lancet Infectious Diseases and The Journal of Infectious Diseases", "Studies on seroprevalence, trial understanding and iris-scan identification"]
    },
    {
      when: "Oct 2017 – Aug 2018", role: "Statistician and Data Manager", org: "KEMRI – University of Washington, Thika, Kenya",
      tags: "HIV prevention, PrEP, cohorts",
      details: ["SCIP: an mHealth safer-conception intervention for serodiscordant couples", "JiPime-JiPrEP: HIV self-testing for PrEP delivery. MPYA: PrEP use in young women", "NuvaRing, GHS (an HSV-2 inception cohort), Merck III (HPV vaccine immunogenicity to 48 months) and the Partners Demonstration Project"]
    },
    {
      when: "Feb 2017 – Sep 2017", role: "Data Management Specialist", org: "PACT Endeleza, University of Maryland, Baltimore (Nairobi)",
      tags: "HIV programme, monitoring and evaluation",
      details: ["Data systems for a comprehensive HIV prevention and treatment programme", "Routine reporting and data-quality audits"]
    },
    {
      when: "Sep 2015 – Jan 2017", role: "Research Assistant", org: "KEMRI – University of Washington, Thika, Kenya",
      tags: "Data collection, REDCap, ODK",
      details: ["Electronic data capture and data cleaning for HIV-prevention research", "Training in research data management with REDCap and ODK (University of Washington)"]
    },
    {
      when: "Sep 2014 – Dec 2014", role: "Junior Statistician (internship)", org: "Ministry of Agriculture, Livestock and Fisheries, Kenya",
      tags: "Official statistics",
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
    { y: 2019, area: "HIV and SRH", title: "Acceptance of contraceptive vaginal ring among women with bacterial vaginosis and their male partners in Kenya (P334)", venue: "Sexually Transmitted Infections 95:A175", authors: "Ngure K, Heller K, Osang'ir I, Irungu E, et al." },
    { y: 2018, area: "HIV and SRH", title: "Contraception use and pregnancy incidence in young African women using PrEP", venue: "AIDS 2018, Abstract P07.09", authors: "Micheni M, Pyra M, Osangir I, Ngure K, Mugo N, Bukusi E, Haberer J, Baeten J." }
  ],

  radar: [
    { k: "Biostatistics", v: 9.5 },
    { k: "Clinical trials", v: 9 },
    { k: "Data management", v: 9.5 },
    { k: "R and software", v: 9.5 },
    { k: "Bioinformatics", v: 8.5 },
    { k: "Machine learning", v: 8 },
    { k: "AI and LLMs", v: 7.5 },
    { k: "Cloud and data pipelines", v: 7 }
  ],

  training: [
    { title: "Machine learning for health", items: ["Supervised and unsupervised learning", "Model evaluation and interpretability", "AutoML platforms: H2O.ai, Google AutoML, DataRobot"] },
    { title: "Responsible use of AI", items: ["Explainable AI", "Fairness in machine learning", "Differential privacy and anonymisation", "Synthetic data for privacy-preserving simulation"] },
    { title: "Language models and agents", items: ["Transformers and LLMs for biomedical data", "Retrieval-augmented generation for health knowledge", "LangChain and LLM orchestration", "Agentic AI and human–AI collaboration", "OpenAI API and Hugging Face for research automation"] },
    { title: "Cloud and data engineering", items: ["AWS, Google Cloud and Azure for health data", "BigQuery and Snowflake", "Airflow and Prefect", "dbt and ETL pipelines", "Docker and GitHub for reproducibility"] },
    { title: "Health data standards", items: ["FHIR and HL7 interoperability", "OMOP Common Data Model (OHDSI)", "Real-world data and evidence", "Good Clinical Practice and human-subjects protection", "GDPR and HIPAA compliance"] },
    { title: "Spatial analysis, M&E and dashboards", items: ["Spatial epidemiology in R (sf, tmap, spdep)", "QGIS and ArcGIS Pro", "M&E and implementation research (MEASURE Evaluation)", "Shiny, Dash, Streamlit, Power BI, Tableau and Grafana"] }
  ]
};
