import { useLocale } from '../../hooks/useLocale'
import { Reveal } from './shared'
import { IconBuilding, IconRobot, IconBraces, IconCircleCheck, IconCode, IconDatabase, IconFlask, IconGitBranch, IconDeviceDesktop, IconSearch, IconShieldCheck, IconSparkles, IconTerminal2, IconRoute } from '@tabler/icons-react'

const PRODUCT_ICONS = [IconBuilding, IconFlask, IconGitBranch, IconShieldCheck, IconCode, IconSparkles]
const AGENT_ICONS = [IconRobot, IconBuilding, IconSearch, IconDeviceDesktop, IconBraces, IconTerminal2]

const COPY = {
  en: {
    eyebrow: 'Data Solutions', title: 'production data for agents that have to work',
    intro: 'The same discipline behind our systems and public evidence, delivered as data: reproducible environments, expert trajectories, and evaluations for difficult, long-horizon work. Your corpus stays private; every delivered artefact stays traceable.',
    datasets: [
      ['Mobile application behaviour', 'Source-level app behaviour, permissions, endpoints, consent timing, and observed data flows.'],
      ['SDK & tracker graph', 'Reusable SDKs, tracker relationships, infrastructure, and cross-application recurrence mapped as connected evidence.'],
      ['Agent safety trajectories', 'Tool-use traces under injection, conflicting instructions, boundary pressure, recovery, and stop conditions.'],
      ['World-state & causality', 'Multi-domain observations, entity relationships, change histories, and evidence-linked causal chains.'],
      ['Stressed benchmark variants', 'Controlled, reproducible perturbations of open benchmarks for robustness testing beyond clean inputs.'],
    ],
    deliverEyebrow: 'What we deliver', deliverTitle: 'From environment to evaluation',
    deliverIntro: 'We define success criteria with your team, then build the data operation around the way your models are actually trained and evaluated. No anonymous task stream and no benchmark theatre: the environment, trace, label, and decision remain connected.',
    products: [
      ['Virtual environments', 'Human-simulated companies, computer-use and MCU mockups, deterministic resets, and controlled credentials for repeatable agent work.'],
      ['Capability evaluations', 'MCP-bench and TAU-bench extensions, TinyTAU for on-device agents, and task suites built around your real tools and constraints.'],
      ['Trajectory data', 'Expert demonstrations, step-level annotations, preference labels, failure taxonomies, and calibrated evaluations for training and reward shaping.'],
      ['Safety evaluation', 'Coding-agent safety, MCP injection assessment, computer-use injection red teaming, and adversarial trajectories with reproducible evidence.'],
      ['Coding data', 'Repository-scale generation, issue resolution, code review, testing, debugging, tool-use, data analysis, and visual frontend tasks.'],
      ['Synthetic enhancement', 'Domain adaptation, controlled variation, hard-negative generation, and dataset expansion without losing provenance or evaluation integrity.'],
    ],
    agentsEyebrow: 'Built for', agentsTitle: 'Agents across the whole tool chain',
    agents: [
      ['Conversational agents', 'Natural-language dialogue grounded in evidence and policy.'], ['Corporate assistants', 'Internal tools, workflows, knowledge bases, and governed automation.'],
      ['Deep-research agents', 'Multi-source investigation, synthesis, and defensible conclusions.'], ['Computer-use agents', 'Browsers, applications, filesystems, and realistic interfaces.'],
      ['Coding copilots', 'Code writing, debugging, repository work, testing, and review.'], ['OS & device agents', 'Desktop, mobile, embedded, wearable, and on-device environments.'],
    ],
    pipelineEyebrow: 'How it works', pipelineTitle: 'A managed pipeline, built by engineers for engineers',
    pipeline: [
      ['01', 'Define', 'Objectives, constraints, rubrics, formats, and acceptance criteria become a testable specification.'],
      ['02', 'Build & execute', 'We create the environment and tasks. Experts perform the work while the complete raw trajectory is recorded.'],
      ['03', 'Validate', 'Automated checks enforce schemas, invariants, logical consistency, rubric adherence, and task completion.'],
      ['04', 'Review', 'Senior reviewers audit difficult and flagged traces plus a statistically meaningful sample of the remainder.'],
      ['05', 'Deliver', 'Versioned datasets, evaluation reports, deterministic environments, and audit logs arrive ready for your workflow.'],
    ],
    qualityTitle: 'Privacy, security, reproducibility',
    quality: ['PII scrubbing and client-approved handling', 'Containerized environments and controlled test credentials', 'Versioned inputs, deterministic resets, and exact replay', 'Per-step safety, quality, and failure labels'],
    startEyebrow: 'Three ways to start', startTitle: 'Data that meets you where the work is',
    starts: [
      ['01', 'Ready to deliver', 'Use an already produced and validated dataset. We align the format and delivery boundary with your stack.'],
      ['02', 'Pipeline-ready', 'Start a prepared collection or evaluation pipeline, adjusted to your volume, domain, and acceptance criteria.'],
      ['03', 'Expand or customize', 'Extend an existing corpus, adapt it to your domain, or commission a new environment and dataset from first principles.'],
    ],
    expertsEyebrow: 'Expert depth', expertsTitle: 'Not crowd work. Technical work.',
    expertsText: 'The work is produced and reviewed at the level where our own systems are built: Python, Rust, C/C++, JavaScript and TypeScript, Go, Java, Kotlin, SQL, Bash, mobile and ML stacks — across backend, frontend, systems, security, DevOps, data science, and model engineering.',
    cta: 'Talk to a data engineer',
  },
  de: {
    eyebrow: 'Data Solutions', title: 'Produktionsdaten für Agenten, die wirklich arbeiten müssen',
    intro: 'Dieselbe Disziplin hinter unseren Systemen und öffentlichen Evidenzen, als Daten geliefert: reproduzierbare Umgebungen, Experten-Trajektorien und Evaluationen für schwierige, langfristige Arbeit. Ihr Korpus bleibt privat; jedes ausgelieferte Artefakt bleibt nachvollziehbar.',
    datasets: [
      ['Verhalten mobiler Anwendungen', 'Quellcodebasiertes App-Verhalten, Berechtigungen, Endpunkte, Consent-Timing und beobachtete Datenflüsse.'],
      ['SDK- & Tracker-Graph', 'Wiederkehrende SDKs, Tracker-Beziehungen, Infrastruktur und App-übergreifende Zusammenhänge als verbundene Evidenz.'],
      ['Agent-Safety-Trajektorien', 'Tool-Use-Traces unter Injection, Zielkonflikten, Grenzdruck, Recovery und expliziten Stop-Bedingungen.'],
      ['World-State & Kausalität', 'Domänenübergreifende Beobachtungen, Entitäten, Veränderungshistorien und evidenzgebundene Kausalketten.'],
      ['Gestresste Benchmark-Varianten', 'Kontrollierte, reproduzierbare Störungen offener Benchmarks für Robustheitstests jenseits sauberer Inputs.'],
    ],
    deliverEyebrow: 'Was wir liefern', deliverTitle: 'Von der Umgebung bis zur Evaluation',
    deliverIntro: 'Gemeinsam definieren wir belastbare Erfolgskriterien und bauen den Datenbetrieb passend zu Ihren realen Trainings- und Evaluationsabläufen. Kein anonymer Task-Stream und kein Benchmark-Theater: Umgebung, Trace, Label und Entscheidung bleiben verbunden.',
    products: [
      ['Virtuelle Umgebungen', 'Von Menschen simulierte Unternehmen, Computer-Use- und MCU-Mockups, deterministische Resets und kontrollierte Zugangsdaten.'],
      ['Capability-Evaluationen', 'Erweiterungen für MCP-bench und TAU-bench, TinyTAU für On-Device-Agenten und Aufgabensuiten für Ihre echten Werkzeuge.'],
      ['Trajectory Data', 'Expertendemonstrationen, Schritt-Annotationen, Präferenzlabels, Fehlerklassen und kalibrierte Evaluationen für Training und Reward Shaping.'],
      ['Safety-Evaluation', 'Sicherheit von Coding-Agenten, MCP-Injection-Assessments, Computer-Use-Red-Teaming und reproduzierbare adversariale Trajektorien.'],
      ['Coding-Daten', 'Repository-Erzeugung, Issue Resolution, Code Review, Tests, Debugging, Tool-Nutzung, Datenanalyse und visuelle Frontend-Aufgaben.'],
      ['Synthetische Erweiterung', 'Domänenanpassung, kontrollierte Variation, Hard Negatives und Korpus-Erweiterung ohne Verlust von Provenienz oder Evaluationsintegrität.'],
    ],
    agentsEyebrow: 'Gebaut für', agentsTitle: 'Agenten entlang der gesamten Toolchain',
    agents: [
      ['Conversational Agents', 'Natürlichsprachlicher Dialog, verankert in Evidenz und Richtlinien.'], ['Corporate Assistants', 'Interne Tools, Workflows, Wissensbasen und kontrollierte Automatisierung.'],
      ['Deep-Research-Agenten', 'Mehrquellen-Recherche, Synthese und belastbare Schlussfolgerungen.'], ['Computer-Use-Agenten', 'Browser, Anwendungen, Dateisysteme und realistische Oberflächen.'],
      ['Coding Copilots', 'Code, Debugging, Repository-Arbeit, Tests und Reviews.'], ['OS- & Device-Agenten', 'Desktop, Mobile, Embedded, Wearables und On-Device-Umgebungen.'],
    ],
    pipelineEyebrow: 'So funktioniert es', pipelineTitle: 'Eine gemanagte Pipeline, von Engineers für Engineers',
    pipeline: [
      ['01', 'Definieren', 'Ziele, Grenzen, Rubrics, Formate und Akzeptanzkriterien werden zu einer testbaren Spezifikation.'],
      ['02', 'Bauen & ausführen', 'Wir erstellen Umgebung und Aufgaben. Experten führen sie aus; die vollständige rohe Trajektorie wird erfasst.'],
      ['03', 'Validieren', 'Automatische Checks prüfen Schema, Invarianten, logische Konsistenz, Rubric-Treue und Aufgabenerfüllung.'],
      ['04', 'Prüfen', 'Senior Reviewer auditieren schwierige und markierte Traces sowie eine statistisch belastbare Stichprobe.'],
      ['05', 'Ausliefern', 'Versionierte Datensätze, Eval-Reports, deterministische Umgebungen und Audit-Logs kommen workflow-fertig an.'],
    ],
    qualityTitle: 'Datenschutz, Sicherheit, Reproduzierbarkeit',
    quality: ['PII-Bereinigung und freigegebene Datenverarbeitung', 'Containerisierte Umgebungen und kontrollierte Testzugänge', 'Versionierte Inputs, deterministische Resets und exakte Replays', 'Safety-, Qualitäts- und Fehlerlabels pro Schritt'],
    startEyebrow: 'Drei Einstiege', startTitle: 'Daten passend zum Stand Ihres Vorhabens',
    starts: [
      ['01', 'Sofort lieferbar', 'Nutzen Sie einen bereits produzierten und validierten Datensatz, abgestimmt auf Format und Liefergrenze Ihres Stacks.'],
      ['02', 'Pipeline-ready', 'Starten Sie eine vorbereitete Collection- oder Eval-Pipeline, angepasst an Volumen, Domäne und Kriterien.'],
      ['03', 'Erweitern oder anpassen', 'Erweitern Sie einen Korpus, adaptieren Sie ihn an Ihre Domäne oder beauftragen Sie Umgebung und Datensatz von Grund auf.'],
    ],
    expertsEyebrow: 'Expertentiefe', expertsTitle: 'Keine Crowd-Arbeit. Technische Arbeit.',
    expertsText: 'Produktion und Review finden auf derselben Ebene statt, auf der wir unsere eigenen Systeme bauen: Python, Rust, C/C++, JavaScript und TypeScript, Go, Java, Kotlin, SQL, Bash, Mobile- und ML-Stacks — in Backend, Frontend, Systems, Security, DevOps, Data Science und Model Engineering.',
    cta: 'Mit einem Data Engineer sprechen',
  },
} as const

export function DataSolutionsSection({ onContact }: { onContact: () => void }) {
  const { locale } = useLocale()
  const c = COPY[locale]
  return <div className="data-solutions">
    <header className="data-hero data-wrap">
      <Reveal><p className="data-eyebrow">{c.eyebrow}</p><h1>{c.title}</h1></Reveal>
      <Reveal delay={1}><p className="data-lede">{c.intro}</p></Reveal>
    </header>

    <section className="data-section data-datasets"><div className="data-wrap">
      <div className="data-dataset-grid">{c.datasets.map(([title, body], i) => { const Icon = [IconDeviceDesktop, IconGitBranch, IconShieldCheck, IconRoute, IconFlask][i]; return <Reveal key={title} delay={(i % 3) + 1}><article className="rfi-glass-flat rfi-glass-solid rfi-hover-card"><div className="data-icon"><Icon size={28} stroke={1.6} /></div><h3>{title}</h3><p>{body}</p></article></Reveal> })}</div>
      <Reveal><div className="data-dataset-cta"><button className="data-cta" onClick={onContact}>{c.cta} <span aria-hidden="true">→</span></button></div></Reveal>
    </div></section>

    <section className="data-section"><div className="data-wrap">
      <Reveal><div className="data-section-head"><p className="data-eyebrow">{c.deliverEyebrow}</p><h2>{c.deliverTitle}</h2><p>{c.deliverIntro}</p></div></Reveal>
      <div className="data-product-grid">{c.products.map(([title, body], i) => { const Icon = PRODUCT_ICONS[i]; return <Reveal key={title} delay={(i % 3) + 1}><article className="data-product rfi-glass-flat rfi-glass-solid rfi-hover-card"><div className="data-icon"><Icon size={30} stroke={1.6} /></div><span>0{i + 1}</span><h3>{title}</h3><p>{body}</p></article></Reveal> })}</div>
    </div></section>

    <section className="data-section"><div className="data-wrap">
      <Reveal><div className="data-section-head"><p className="data-eyebrow">{c.agentsEyebrow}</p><h2>{c.agentsTitle}</h2></div></Reveal>
      <div className="data-agent-grid">{c.agents.map(([title, body], i) => { const Icon = AGENT_ICONS[i]; return <Reveal key={title} delay={(i % 3) + 1}><article className="rfi-glass-flat rfi-glass-solid rfi-hover-card"><Icon size={27} stroke={1.6} /><div><h3>{title}</h3><p>{body}</p></div></article></Reveal> })}</div>
    </div></section>

    <section className="data-section"><div className="data-wrap">
      <Reveal><div className="data-section-head"><p className="data-eyebrow">{c.pipelineEyebrow}</p><h2>{c.pipelineTitle}</h2></div></Reveal>
      <div className="data-pipeline">{c.pipeline.map(([n, title, body], i) => <Reveal key={n} delay={(i % 3) + 1}><article className="rfi-glass-flat rfi-glass-solid"><span>{n}</span><div className="data-pipeline-icon"><IconRoute size={22} /></div><div><h3>{title}</h3><p>{body}</p></div></article></Reveal>)}</div>
      <Reveal><aside className="data-quality rfi-glass-flat rfi-glass-solid"><div className="data-quality-title"><IconShieldCheck size={32} /><h3>{c.qualityTitle}</h3></div><ul>{c.quality.map(item => <li key={item}><IconCircleCheck size={17} />{item}</li>)}</ul></aside></Reveal>
    </div></section>

    <section className="data-section"><div className="data-wrap">
      <Reveal><div className="data-section-head"><p className="data-eyebrow">{c.startEyebrow}</p><h2>{c.startTitle}</h2></div></Reveal>
      <div className="data-start-grid">{c.starts.map(([n, title, body], i) => <Reveal key={n} delay={i + 1}><article className="rfi-glass-flat rfi-glass-solid rfi-hover-card"><span>{n}</span><IconDatabase size={30} stroke={1.5} /><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div>
    </div></section>

    <section className="data-experts data-wrap"><Reveal><p className="data-eyebrow">{c.expertsEyebrow}</p><h2>{c.expertsTitle}</h2><p>{c.expertsText}</p><button className="data-cta" onClick={onContact}>{c.cta} <span aria-hidden="true">→</span></button></Reveal></section>
  </div>
}
