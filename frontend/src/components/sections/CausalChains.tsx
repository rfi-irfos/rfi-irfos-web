// "Causality Chains" section (`#causal-chains`) - placed directly above the
// Contact & Disclosures (Submit) section on Home. Mirrors the site's section
// vocabulary: Reveal, ScrambleHeading, JetBrains Mono eyebrow, glass cards.
//
// Interaction model (per spec 2026-08-20):
//  - Each chain header shows its position and title in one line: "# 01/20: title".
//  - ONE step shown at a time as a centered card; nav buttons show the stage;
//    the flat GRAPH visualizer sits UNDER the nav buttons at the very bottom.
//  - Two SCENARIO arrows flank the widget (outside it, vertically centered).
type Chain = {
  title: string
  nodes: string[]
  icon: keyof typeof ICONS
}

import { useState, useMemo, useRef, cloneElement } from 'react'
import {
  IconAlertTriangle, IconBuildingBank, IconBuildingBridge, IconBuildingBroadcastTower,
  IconBuildingFactory, IconChartCandle, IconCloudRain, IconCoins, IconContainer,
  IconCrane, IconCurrencyDollar, IconDroplet, IconFileText, IconFlame, IconMountain,
  IconPackage, IconPlane, IconPower, IconRipple, IconRoad, IconRoadOff, IconShip,
  IconShieldExclamation, IconSnowflake, IconTemperature, IconTool, IconTrain,
  IconTruck, IconUsers, IconVirus, IconVolcano, IconWheat, IconWind, IconWorld,
  IconWorldDown,
} from '@tabler/icons-react'
import { Reveal, ScrambleHeading } from './shared'
import { useLocale } from '../../hooks/useLocale'

// Curated SVG map. Recognizable object silhouettes come from Tabler Icons (MIT);
// chain-specific state compounds remain local where no single library glyph can
// tell the event accurately.
const I = (d: string) => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)
const T = (Icon: typeof IconShip) => <Icon width={52} height={52} stroke={1.65} aria-hidden="true" />
const ICONS = {
  seismic: I('M3 12h2l1.5-4 3 10 3-14 3 10 1.5-2H22M5 5h2M17 5h2M4 19h3M17 19h3'),
  rain: T(IconCloudRain),
  mountain: T(IconMountain),
  rockfall: I('M3 20l6-11 4 7 3-5 5 9zM7 13l2-4 2 3M17 3l-2 3M20 6l-2 2M15 8l-2 2M9 20h6'),
  snowflake: T(IconSnowflake),
  shield: T(IconShieldExclamation),
  sun: I('M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19'),
  water: T(IconRipple),
  fire: T(IconFlame),
  ship: T(IconShip),
  bolt: I('M13 2L4 13h7l-1 9 9-12h-7zM5 4l1 1M19 18l1 1M3 12H1M21 12h2'),
  virus: T(IconVirus),
  thermometer: T(IconTemperature),
  power: T(IconPower),
  box: T(IconPackage),
  money: T(IconCurrencyDollar),
  people: T(IconUsers),
  wind: T(IconWind),
  volcano: T(IconVolcano),
  drop: T(IconDroplet),
  globe: T(IconWorld),
  coin: T(IconCoins),
  train: T(IconTrain),
  transitClock: I('M3 7h10a3 3 0 0 1 3 3v5H3zM6 15l-2 4M12 15l2 4M6 11h6M18 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM18 6v2l1 1M3 21h11'),
  bridge: T(IconBuildingBridge),
  factory: T(IconBuildingFactory),
  leaf: I('M2 22 16 8M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94zM7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94zM11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94zM20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4z'),
  bank: T(IconBuildingBank),
  document: T(IconFileText),
  package: T(IconPackage),
  container: T(IconContainer),
  fork: I('M12 21V8M12 8L6 3M12 8l6-5M6 3v4M18 3v4M4 21h16'),
  costRise: I('M4 19V5M4 19h17M7 16l4-4 3 2 5-8M16 6h3v3'),
  costFall: I('M4 5v14M4 19h17M7 7l4 4 3-2 6 8M16 19h4v-4'),
  brokenRoad: T(IconRoadOff),
  truck: T(IconTruck),
  factoryDown: I('M3 20V9l6 3V8l6 3V6l6 3v11zM7 16h2M12 16h2M17 16h2M17 3v7M14 7l3 3 3-3'),
  deadline: I('M5 4h14v17H5zM8 2v4M16 2v4M5 9h14M9 13h.01M13 13h.01M9 17h.01M13 17h.01M17 13h.01'),
  penalty: I('M6 3h9l4 4v14H6zM15 3v5h4M9 13h6M9 17h4M17 14v5M15 17h4'),
  cashFlowDown: I('M4 7h7a3 3 0 1 1 0 6H8M8 10l-3 3 3 3M20 5v14M16 9l4-4'),
  credit: I('M3 8h18v12H3zM3 12h18M7 16h4M16 16h2M7 5h10'),
  risk: I('M12 3l9 4v5c0 5-3 8-9 10-6-2-9-5-9-10V7zM12 9v5M12 17h.01M17 5l2-2'),
  insuranceClaim: I('M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6zM9 10h5a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h5M12 8v11'),
  river: I('M4 3c8 2 8 6 0 9s0 7 8 9M20 3c-8 2-8 6 0 9M4 12h6M14 12h6'),
  delta: I('M12 21V14M12 14L5 7M12 14l7-7M5 7v4M19 7v4M3 21h18'),
  boundary: I('M12 3c-4 3-4 6 0 9s4 6 0 9M4 3c4 3 4 6 0 9s-4 6 0 9M12 12h8'),
  salt: I('M12 3l2 5h5l-4 3 2 6-5-3-5 3 2-6-4-3h5zM4 20h16'),
  airspaceRestricted: I('M3 12l18-6-6 18-3-8-9-4zM12 16l-2 5M4 4l16 16'),
  flightCancelled: I('M3 12l18-6-6 18-3-8-9-4zM12 16l-2 5M17 3l4 4M21 3l-4 4'),
  hubThrottled: I('M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 12v8M5 20h14M4 7H2M22 7h-2M8 15h8'),
  coldChainStall: I('M4 7h12v11H4zM16 10h3l2 3v5h-5M7 4v6M4 7h6M7 15v6M4 18h6M18 14v4'),
  oilSupply: I('M5 21V8h9v13M7 8l3-5 4 5M10 3v18M14 12h5l2 3v6M17 12v9M3 21h19'),
  oilRise: I('M5 5h8v16H5zM7 8h4M7 12h4M13 9h3l2 3v5M18 17a2 2 0 0 0 4 0v-5M16 7l5-4M18 3h3v3'),
  shelfDown: I('M4 5h13v14H4zM4 10h13M4 15h13M7 7h3M11 12h3M7 17h2M20 6v12M17 15l3 3 3-3'),
  revenueDown: I('M4 5v14M4 19h17M7 7l4 4 3-2 6 8M16 19h4v-4M8 3v5M6 5h4'),
  marginDown: I('M5 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM19 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM6 19L18 5M14 10l5 5M19 15v-4'),
  budgetTight: I('M3 10l9-6 9 6M5 10h14M7 10v7M12 10v7M17 10v7M3 20h18M18 4v4M16 6h4'),
  reroute: I('M4 7h8a4 4 0 0 1 4 4v6M13 14l3 3 3-3M4 17h5M4 14v6'),
  procurement: I('M3 5h2l2 10h10l3-7H7M9 19a1 1 0 1 0 0 2M17 19a1 1 0 1 0 0 2M14 10l2 2 4-5'),
  investmentDecision: I('M4 19V5M4 19h17M7 15l4-4 3 2 5-7M16 6h3v3M7 3v4'),
  policyChange: I('M5 3h10l4 4v14H5zM15 3v5h4M8 13h8M8 17h5M3 9l2-2M3 9l2 2'),
  plane: T(IconPlane),
  road: T(IconRoad),
  chart: I('M12 16v5M16 14v7M20 10v11m2-18-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15M4 18v3M8 14v7'),
  crane: T(IconCrane),
  wrench: T(IconTool),
  signal: T(IconBuildingBroadcastTower),
  warning: T(IconAlertTriangle),
  portDamage: I('M3 20h18M5 20V9h14v11M8 9V6h8v3M7 14h3M14 14h3M11 9l-2 4 3 2-2 5'),
  handlingDown: I('M4 20V7h5v13M15 20V7h5v13M7 7V4h10v3M7 13h10M12 10v8M9 15l3 3 3-3'),
  shipReroute: T(IconShip),
  transitDelay: T(IconTrain),
  containerDelay: I('M3 7h13v11H3zM6 7v11M10 7v11M14 7v11M19 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6M19 14v2h2'),
  globalFreightDown: T(IconWorldDown),
  freightRateUp: T(IconCurrencyDollar),
  agriInputUp: T(IconWheat),
  regionalCostUp: I('M3 20V10l5 3V9l5 3V7l5 3v10M6 17h2M11 17h2M16 17h2M18 7V3M15 6l3-3 3 3'),
  plantingShift: I('M4 21V9M4 15h5M9 15l-2-2M9 15l-2 2M20 21V9M20 15h-5M15 15l2-2M15 15l2 2M8 7c0-3 2-5 4-5 0 3-1 5-4 5M16 7c0-3-2-5-4-5 0 3 1 5 4 5'),
  fieldArea: I('M3 8l9-5 9 5-9 5zM3 8v9l9 4 9-4V8M7 11v8M12 13v8M17 11v8'),
  seasonalSupply: I('M12 3v3M12 18v3M4 12H1M23 12h-3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2M9 15c1-4 3-6 7-6-1 4-3 6-7 6'),
  futuresMarket: T(IconChartCandle),
  spotMarket: I('M3 19V5M3 19h18M7 14l3-3 3 2 5-5M18 5v6M15 8h6M18 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4'),
  foodProcurement: I('M3 6h2l2 10h10l3-7H7M9 20h.01M17 20h.01M11 6c0-2 2-4 5-4 0 3-2 5-5 5'),
  consumerPrice: I('M4 7h16l-2 13H6zM8 7V4h8v3M9 12h6M12 10v6M9 14h6'),
  pricePolicy: I('M5 3h10l4 4v14H5zM15 3v5h4M8 12h8M8 16h5M3 10h4M3 10l2-2M3 10l2 2M17 15l2-2 2 2'),
  fiscalBurden: I('M3 20h18M5 20V9h14v11M3 9l9-6 9 6M8 12v5M12 12v5M16 12v5M18 4v5M16 6h4'),
  infrastructureInvest: I('M3 20h18M5 20V10h14v10M7 10l5-6 5 6M9 20v-5h6v5M18 8V3M15 6l3-3 3 3'),
  saturatedSoil: I('M3 17c3-2 6-2 9 0s6 2 9 0M3 21h18M7 13c0-2 2-4 2-6 2 2 2 4 2 6a3 3 0 0 1-6 0'),
  slopeRisk: I('M3 20h18L8 7zM12 7l3-3M16 8l3-3M13 12l3 4M16 12l-3 4'),
  freightDown: I('M3 8h11v9H3zM14 11h4l3 3v3h-7M6 19h.01M18 19h.01M5 5h6M17 5v4M14 7l3 2 3-2'),
  missedDeadline: I('M5 5h14v16H5zM8 3v4M16 3v4M5 10h14M8 14h5M16 13l4 4M20 13l-4 4'),
  employmentDown: I('M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 19a5 5 0 0 1 10 0M17 8h5M17 12h5M19 15v6M16 18l3 3 3-3'),
  consumptionDown: I('M3 6h2l2 10h10l3-7H7M9 20h.01M17 20h.01M16 4v5M13 6l3 3 3-3'),
  maintenanceDeferred: I('M14 6a4 4 0 0 0-5 5l-6 6 3 3 6-6a4 4 0 0 0 5-5M16 3v7M13 6l3 4 3-4'),
  failureRiskUp: I('M12 3l9 4v5c0 5-3 8-9 10-6-2-9-5-9-10V7zM12 8v5M12 17h.01M17 7l3-3M17 4h3v3'),
  sedimentUp: I('M3 18c4-3 7 3 11 0s5-1 7-2M5 21h14M8 14h.01M12 12h.01M16 14h.01M18 9v5M15 11l3 3 3-3'),
  riverMorphology: I('M3 4c7 2 2 6 9 8s2 6 9 8M3 8c5 1 3 5 8 6s4 4 10 2M16 4v5M13 6l3 3 3-3'),
  sedimentDeposit: I('M3 7c5 0 6 4 11 4s5 2 7 5M4 20h16M7 17h.01M11 18h.01M15 16h.01M19 18h.01M12 3v5M9 6l3 3 3-3'),
  deltaSection: I('M12 20V13M12 13L5 6M12 13l7-7M4 20h16M5 6v5M19 6v5M7 17h10M9 14h6'),
  flowRedistributed: I('M4 4c6 2 4 7 8 8M12 12c4 1 2 6 8 8M12 12c-4 1-2 6-8 8M16 6l4-2-1 4M8 16l-4 4 5 1'),
  salinityBoundary: I('M3 7c4-3 7 3 10 0s5-2 8 0M3 17c4-3 7 3 10 0s5-2 8 0M12 3v18M6 11h3M15 11h3M7 9l1 4M17 9l-1 4'),
  salineSoil: I('M3 18c4-2 7 2 11 0s5-1 7-1M4 21h16M12 3l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z'),
  snowReservoirDown: I('M4 19h16M5 15c4-2 10-2 14 0M7 11l3-7 3 5 2-3 3 5M18 13v7M15 17l3 3 3-3'),
  meltDown: I('M5 8l3-5 3 5 3-5 4 7M4 14c4-2 7 2 11 0s4-1 6 0M12 15v6M9 18l3 3 3-3'),
  reservoirInflowDown: I('M3 18h18M4 14c4-2 7 2 11 0s5-2 7 0M4 5c4 0 5 4 9 4M17 4v7M14 8l3 3 3-3'),
  hydroDown: I('M3 18h18M5 18V8h5l2-4 2 4h5v10M8 12h8M12 10v6M18 3v6M15 6l3 3 3-3'),
  gridSupplyDown: I('M4 20l4-16 4 16M12 20l4-16 4 16M6 10h12M5 15h14M18 3v6M15 6l3 3 3-3'),
  thermalReserve: I('M5 20h14M7 20V8h10v12M9 8c0-3 2-5 3-5 0 3 3 4 3 7M10 15h4M12 12v6'),
  gasDemandUp: I('M10 3c3 4-2 6 1 10 2-2 3-3 4-6 3 4 5 7 3 11-2 4-10 3-10-3 0-3 2-5 2-8M18 15v-5M15 13l3-3 3 3'),
  industryHoursDown: I('M3 20V10l5 3V9l5 3V7l5 3v13M6 17h2M11 17h2M16 17h2M19 4a3 3 0 1 0 0 6M19 6v2h2M14 4v5M11 7l3 3 3-3'),
  metalOutputDown: I('M4 20h16M6 20l2-9h8l2 9M9 11l1-6h4l1 6M18 3v6M15 6l3 3 3-3'),
  droughtSystem: I('M12 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12M12 1v2M4 4l2 2M20 4l-2 2M3 18h18M5 21l3-3 3 3 3-3 3 3'),
  moistureDown: I('M9 3s5 5 5 9a5 5 0 0 1-10 0c0-4 5-9 5-9M16 5h5M18 8l3-3-3-3M16 17v5M13 19l3 3 3-3'),
  cropStress: I('M4 21c2-7 6-12 13-14-1 7-5 12-13 14M8 16l3 3M11 16l-3 3M16 4l4 4M20 4l-4 4'),
  yieldDown: I('M3 20h18M6 20V9M6 13c3-1 5 0 7 3M6 11c3 0 5-2 7-5M18 5v8M15 10l3 3 3-3'),
  grainReserveDown: I('M4 20h16V7H4zM7 7V4h10v3M8 11h8M8 15h5M18 13v7M15 17l3 3 3-3'),
  livestockDown: I('M4 15V9l4-3 5 2 4-2 3 4v5M6 15v5M17 15v5M9 12h.01M20 9l2-2M18 17v5M15 19l3 3 3-3'),
  cheaperCalories: I('M4 5h16v14H4zM8 9h8M8 13h5M18 12v6M15 15l3 3 3-3M6 3v4M18 3v4'),
  transmissionFire: I('M5 21l4-18 4 18M13 21l3-14 3 14M7 11h10M6 16h12M19 3c0 3-3 3-2 6 3-1 4-3 3-6'),
  lineDeenergized: I('M4 20l4-16 4 16M12 20l4-16 4 16M6 10h12M5 15h14M3 3l18 18'),
  substationRisk: I('M4 20V8h16v12M7 12h10M9 8V5h6v3M12 11l-2 4h3l-1 4 4-6h-3l1-2M18 3l3 5h-6z'),
  townBlackout: I('M3 20h18M5 20v-8l5-4 4 3 5-4v13M8 15h2M15 14h2M3 3l18 18'),
  pumpStopped: I('M4 20V8h8v12M7 8V5h3v3M12 12h4l2 2v6M16 12v-3h4M3 3l18 18'),
  pressureDown: I('M4 6h16M6 6v8a6 6 0 0 0 12 0V6M9 14h6M12 10v8M18 16v6M15 19l3 3 3-3'),
  telecomBattery: I('M5 21l7-18 7 18M8 14h8M9 10h6M18 5c2 1 3 3 3 5M6 5c-2 1-3 3-3 5M17 17h5v4h-5z'),
  coverageDown: I('M5 17a10 10 0 0 1 14 0M8 14a6 6 0 0 1 8 0M11 11a2 2 0 0 1 2 0M12 18v3M19 3v7M16 7l3 3 3-3'),
  businessClosed: I('M4 10h16l-2-5H6zM5 10v10h14V10M8 20v-6h8v6M3 3l18 18'),
  ransomware: I('M6 11V8a6 6 0 0 1 12 0v3M4 11h16v10H4zM12 15v3M3 4l4 4M21 4l-4 4'),
  loadingOffline: I('M4 20V7h11v13M15 11h4l2 3v6h-6M7 11h5M7 15h5M3 3l18 18'),
  dispatchHalt: I('M3 9h11v8H3zM14 12h4l3 3v2h-7M6 19h.01M18 19h.01M4 4l16 16'),
  fuelTankDown: I('M5 20V5h10v15M8 9h4M15 9h3l2 3v6M20 18h2M18 14v6M15 17l3 3 3-3'),
  localShortage: I('M5 20V6h10v14M8 10h4M15 9h3l2 3v8M8 14h4M20 4v7M20 15h.01'),
  reservesReleased: I('M4 20V6h12v14M7 10h6M7 14h6M18 5v12M15 14l3 3 3-3M18 17h4'),
  incidentResponse: I('M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6zM12 8v5M12 17h.01M3 4l3 3M21 4l-3 3'),
  pathogenSpread: I('M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2M16 4l5-2M19 1l2 1-1 2'),
  absenteeism: I('M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 19a5 5 0 0 1 10 0M16 7h6M19 4v6M15 15l6 6M21 15l-6 6'),
  plantCapacityDown: I('M3 20V10l5 3V9l5 3V7l5 3v13M6 17h2M11 17h2M16 17h2M18 3v7M15 7l3 3 3-3'),
  overtimeUp: I('M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 19a5 5 0 0 1 10 0M18 5a4 4 0 1 0 0 8M18 7v2l2 1M18 16v6M15 19l3-3 3 3'),
  automationDemand: I('M5 8h14v11H5zM8 8V5h8v3M9 13h.01M15 13h.01M9 17h6M3 12H1M23 12h-2M18 3l3 3M21 3v3h-3'),
  hiringPause: I('M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M3 19a5 5 0 0 1 10 0M16 9h6M19 6v6M15 16h8'),
  trainingStall: I('M3 8l9-5 9 5-9 5zM6 10v6c3 3 9 3 12 0v-6M21 8v8M17 20h4M15 15l6 6M21 15l-6 6'),
  wagePressure: I('M12 3v18M8 7h6a2 2 0 0 1 0 4H8a2 2 0 0 0 0 4h8M18 15v-6M15 12l3-3 3 3'),
  gridFrequency: I('M3 12h3l2-5 3 10 3-10 2 5h5M5 4h14M5 20h14'),
  loadShedding: I('M4 20l4-16 4 16M12 20l4-16 4 16M6 10h12M5 15h14M3 3l18 18'),
  substationTrip: I('M4 20V8h16v12M7 12h10M9 8V5h6v3M12 11l-2 4h3l-1 4 4-6h-3l1-2M3 3l18 18'),
  harborCraneStop: I('M4 20V4h13M4 8h13M8 4v16M17 8v7M17 15l3 3M3 3l18 18'),
  reeferWarm: I('M4 7h12v12H4zM16 10h3l2 3v6h-5M7 4v6M4 7h6M7 15v6M18 7c3 3 3 7 0 10'),
  customsStall: I('M5 3h10l4 4v14H5zM15 3v5h4M8 12h8M8 16h5M3 10h3M18 15h4M20 13v4'),
  demurrage: I('M3 17h11l-2 3H6zM8 10v7M5 10h6M16 7a4 4 0 1 0 0 8M16 9v2l2 1M19 15v6M16 18l3 3 3-3'),
  backupGenerator: I('M4 7h16v12H4zM8 11h.01M8 15h.01M12 11h5M12 15h5M3 12H1M23 12h-2M18 4l3-2M6 4L3 2'),
  ashPlume: I('M4 20l6-12 3 5 2-4 5 11M8 8l1-4M12 7V2M16 8l2-4M7 3c2-2 3 1 5-1s3-1 5 1'),
  airportHub: I('M3 19h18M5 19V8h14v11M8 8V5h8v3M8 13h8M12 10v6M3 3l18 18'),
  cargoStranded: I('M3 8l9-5 9 5v10l-9 4-9-4zM3 8l9 5 9-5M12 13v9M5 5l14 14'),
  roadRailRebook: I('M3 7h7v7H3zM10 10h4M12 8l2 2-2 2M14 7h7v7h-7M5 17h14M7 17l-2 4M17 17l2 4'),
  tourismDown: I('M4 20V8h16v12M7 8V5h10v3M8 13h8M12 10v7M19 3v7M16 7l3 3 3-3'),
  airportRevenueDown: I('M3 19h18M5 19V8h14v11M8 8V5h8v3M8 13h8M12 10v6M19 3v6M16 6l3 3 3-3'),
  ashMonitoring: I('M4 20l6-12 3 5 2-4 5 11M8 8l1-4M12 7V2M16 8l2-4M18 4a4 4 0 1 1-1 7M18 6v2l2 1'),
} as const

// Editorially curated, step-for-step icon sequences. These arrays deliberately
// mirror the source chains in content/en.ts and content/de.ts. There is no
// semantic guessing or index fallback in the rendered widget: every displayed
// step has an explicit visual decision.
const ALL_CURATED_ICON_KEYS: readonly (readonly (keyof typeof ICONS)[])[] = [
  ['seismic','portDamage','handlingDown','shipReroute','transitDelay','containerDelay','globalFreightDown','freightRateUp','agriInputUp','regionalCostUp','plantingShift','fieldArea','seasonalSupply','futuresMarket','spotMarket','foodProcurement','consumerPrice','pricePolicy','fiscalBurden','infrastructureInvest'],
  ['rain','saturatedSoil','slopeRisk','brokenRoad','freightDown','factoryDown','missedDeadline','penalty','cashFlowDown','credit','risk','bank','investmentDecision','employmentDown','consumptionDown','revenueDown','budgetTight','maintenanceDeferred','failureRiskUp'],
  ['rockfall','sedimentUp','riverMorphology','sedimentDeposit','deltaSection','flowRedistributed','salinityBoundary','salineSoil','leaf','policyChange','revenueDown','people','people','costRise','investmentDecision','policyChange','riverMorphology'],
  ['snowflake','snowReservoirDown','meltDown','reservoirInflowDown','hydroDown','gridSupplyDown','thermalReserve','gasDemandUp','oilRise','costRise','industryHoursDown','metalOutputDown','globalFreightDown','regionalCostUp','fork','investmentDecision','maintenanceDeferred'],
  ['warning','risk','insuranceClaim','reroute','transitClock','ship','costRise','costRise','container','factoryDown','costRise','document','investmentDecision','fork','policyChange'],
  ['droughtSystem','moistureDown','cropStress','yieldDown','grainReserveDown','futuresMarket','agriInputUp','livestockDown','consumerPrice','cheaperCalories','marginDown','consumerPrice','globalFreightDown','fork','consumerPrice'],
  ['rain','warning','water','brokenRoad','brokenRoad','truck','container','container','deadline','factoryDown','costRise','penalty','costRise','fork','insuranceClaim'],
  ['transmissionFire','lineDeenergized','substationRisk','loadShedding','townBlackout','pumpStopped','pressureDown','telecomBattery','coverageDown','reroute','businessClosed','coldChainStall','insuranceClaim','maintenanceDeferred','pricePolicy'],
  ['people','ship','container','container','deadline','factoryDown','deadline','container','procurement','deadline','revenueDown','document','investmentDecision','policyChange','costRise'],
  ['ransomware','loadingOffline','dispatchHalt','freightDown','fuelTankDown','localShortage','oilRise','reservesReleased','reroute','freightRateUp','regionalCostUp','incidentResponse','maintenanceDeferred','insuranceClaim','shield'],
  ['pathogenSpread','absenteeism','people','plantCapacityDown','factoryDown','overtimeUp','regionalCostUp','consumerPrice','automationDemand','hiringPause','trainingStall','wagePressure','policyChange','risk','document'],
  ['thermometer','bolt','chart','risk','costRise','warning','power','bolt','people','power','factoryDown','factoryDown','penalty','money','costRise'],
  ['gridFrequency','loadShedding','substationTrip','lineDeenergized','townBlackout','harborCraneStop','reeferWarm','risk','customsStall','shipReroute','transitDelay','demurrage','insuranceClaim','backupGenerator','pricePolicy'],
  ['warning','package','container','factoryDown','fork','box','container','deadline','plane','costRise','costFall','fork','deadline','document','globe'],
  ['costFall','money','costRise','document','costFall','costRise','costFall','factory','shield','factory','document','credit','cashFlowDown','bank','costFall'],
  ['people','people','box','chart','people','people','costRise','people','costRise','fork','fork','people','money','money','people'],
  ['wind','people','factoryDown','factoryDown','costRise','container','fork','factoryDown','costFall','ship','costRise','document','insuranceClaim','deadline','costFall'],
  ['volcano','ashPlume','airspaceRestricted','flightCancelled','airportHub','cargoStranded','coldChainStall','roadRailRebook','freightRateUp','industryHoursDown','tourismDown','airportRevenueDown','insuranceClaim','reroute','ashMonitoring'],
  ['oilSupply','oilRise','oilRise','oilRise','costRise','truck','package','shelfDown','costRise','factory','fork','bolt','penalty','fork','costRise'],
  ['coin','costFall','package','fork','globe','container','container','deadline','document','factory','costRise','document','fork','costRise','globe'],
] as const

// Ten strongest narratives: broad domains, surprising downstream effects, and
// enough visual contrast to make the icon-led story readable without repetition.
const FEATURED_CHAIN_INDEXES = [0, 1, 2, 3, 5, 7, 9, 10, 12, 17] as const
const CURATED_ICON_KEYS = FEATURED_CHAIN_INDEXES.map(index => ALL_CURATED_ICON_KEYS[index])

function curatedStepIcon(chainIndex: number, stepIndex: number) {
  const key = CURATED_ICON_KEYS[chainIndex]?.[stepIndex]
  if (!key) throw new Error(`Missing curated causal-chain icon for chain ${chainIndex + 1}, step ${stepIndex + 1}`)
  return ICONS[key]
}

function stepDescription(node: string, next: string | undefined) {
  const event = node.toLowerCase()
  const consequence = next ? ` Its effect is then tracked into ${next.toLowerCase()}.` : ''
  if (/earthquake|seismic|quake/.test(event)) return `An earthquake is recorded as the initiating event.${consequence}`
  if (/revenue|receipts drop|margin|tax revenue|budget tightens|cash flow/.test(event)) return `A financial loss or constraint is recorded with a clear downward direction.${consequence}`
  if (/insurer|insurance claim|insurance loss|insurance underwriting|business interruption/.test(event)) return `An insurance exposure or claim is recorded against the affected asset or business.${consequence}`
  if (/airspace|flight|airport|hub is throttled|cargo is stranded/.test(event)) return `An aviation constraint is recorded at the affected route, flight, airport or hub.${consequence}`
  if (/crude|benchmark oil|diesel|fuel surcharge|fuel price/.test(event)) return `An oil-supply or fuel-price change is recorded in the energy and freight chain.${consequence}`
  if (/rain|storm|flood|water|river|drought|snow|ice|heat|weather/.test(event)) return `A change in weather or water conditions is recorded and compared with the affected infrastructure.${consequence}`
  if (/fire|wildfire|volcan|eruption|ash/.test(event)) return `A fire or volcanic event is recorded and linked to the exposed locations and routes.${consequence}`
  if (/ship|port|vessel|harbor|freight|rail|train|route|transit|logistics/.test(event)) return `A transport or logistics change is recorded as it moves through the network.${consequence}`
  if (/power|grid|electric|energy|blackout|turbine/.test(event)) return `A change in power or energy supply is recorded and linked to the affected systems.${consequence}`
  if (/cyber|attack|virus|pandemic|pathogen/.test(event)) return `A disruption is recorded and connected to the systems it affects.${consequence}`
  if (/money|price|cost|market|currency|financial|trade|subsidy|investment/.test(event)) return `A market or price change is recorded alongside its surrounding conditions.${consequence}`
  return `This observed event is recorded with its surrounding conditions.${consequence}`
}

const arrowStyle: React.CSSProperties = {
  width: 44, height: 44, borderRadius: '50%', border: '1px solid rgba(0,245,196,0.3)',
  background: 'var(--bg2)', color: 'var(--accent-text)', fontSize: 18, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center',
}

const stepArrowStyle: React.CSSProperties = {
  width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)',
  background: 'var(--bg2)', color: 'var(--text)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
}

function dotColor(i: number, n: number) {
  // light turquoise -> darker blue as you proceed through the chain
  const t = n > 1 ? i / (n - 1) : 0
  const from = [94, 234, 212]   // #5eead4 light turquoise
  const to = [37, 99, 235]      // #2563eb darker blue
  const c = from.map((f, k) => Math.round(f + (to[k] - f) * t))
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`
}

function ChainGraph({ nodes, chainIndex, step, onStep }: { nodes: string[]; chainIndex: number; step: number; onStep: (i: number) => void }) {
  const W = 720
  const H = 88
  const pad = 30
  const usable = W - pad * 2
  const stepX = nodes.length > 1 ? usable / (nodes.length - 1) : 0
  const y = H / 2
  const pts = useMemo(
    () => nodes.map((_, i) => ({ x: pad + i * stepX, y })),
    [nodes.length, stepX]
  )

  return (
    <div style={{ width: '100%', maxWidth: 720, margin: '0 auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 'auto', display: 'block' }}>
        <line x1={pad} y1={y} x2={W - pad} y2={y} stroke="var(--border)" strokeWidth="1.5" />
        <line
          x1={pts[0]?.x ?? pad}
          y1={y}
          x2={pts[step]?.x ?? pad}
          y2={y}
          stroke="var(--accent-text)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.8}
        />
        {pts.map((p, i) => {
          const icon = curatedStepIcon(chainIndex, i)
          const completed = i <= step
          return (
            <g key={i} transform={`translate(${(p.x - (i === step ? 10 : 7)).toFixed(1)} ${(y - (i === step ? 10 : 7)).toFixed(1)})`} onClick={() => onStep(i)} style={{ cursor: 'pointer' }}>
              <circle cx={i === step ? 10 : 7} cy={i === step ? 10 : 7} r={i === step ? 11 : 8} fill={completed ? 'var(--accent-text)' : 'var(--bg2)'} stroke={completed ? 'var(--accent-text)' : dotColor(i, nodes.length)} strokeWidth={i === step ? 1.5 : 1} />
              {cloneElement(icon, { width: i === step ? 17 : 12, height: i === step ? 17 : 12, x: i === step ? 1.5 : 1, y: i === step ? 1.5 : 1, style: { color: completed ? 'var(--bg)' : dotColor(i, nodes.length), pointerEvents: 'none' } })}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function CausalChainsSection() {
  const { t } = useLocale()
  const allChains = (t.causalChains.chains as Chain[]) ?? []
  const chains = FEATURED_CHAIN_INDEXES.map(index => allChains[index]).filter((chain): chain is Chain => Boolean(chain))
  if (chains.length !== CURATED_ICON_KEYS.length) {
    throw new Error(`Causal-chain icon coverage mismatch: ${chains.length} chains, ${CURATED_ICON_KEYS.length} icon sequences`)
  }
  chains.forEach((chain, chainIndex) => {
    if (chain.nodes.length !== CURATED_ICON_KEYS[chainIndex].length) {
      throw new Error(`Causal-chain icon coverage mismatch in chain ${chainIndex + 1}: ${chain.nodes.length} steps, ${CURATED_ICON_KEYS[chainIndex].length} icons`)
    }
  })
  const [scenario, setScenario] = useState(0)
  const [step, setStep] = useState(0)
  const [anim, setAnim] = useState<'left' | 'right' | null>(null)
  const [stepAnim, setStepAnim] = useState<'left' | 'right' | null>(null)
  const animTimer = useRef<number | null>(null)
  const stepAnimTimer = useRef<number | null>(null)

  const n = chains.length
  const safeScenario = n ? scenario % n : 0
  const current = chains[safeScenario]

  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const cycleScenario = (dir: number) => {
    if (!n) return
    setAnim(dir < 0 ? 'right' : 'left')
    if (animTimer.current) window.clearTimeout(animTimer.current)
    animTimer.current = window.setTimeout(() => setAnim(null), reduced ? 0 : 1050)
    setScenario(s => (s + dir + n) % n)
    setStep(0)
  }
  const goStep = (i: number) => {
    if (!current) return
    const len = current.nodes.length
    const next = ((i % len) + len) % len
    const dir = next > step ? 'left' : 'right'
    setStepAnim(dir)
    if (stepAnimTimer.current) window.clearTimeout(stepAnimTimer.current)
    stepAnimTimer.current = window.setTimeout(() => setStepAnim(null), reduced ? 0 : 1050)
    setStep(next)
  }

  return (
    <section id="causal-chains" style={{ padding: '12px var(--sec-pad-x) 72px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Reveal>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, textAlign: 'center' }}>
            {t.causalChains.eyebrow}
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12, textAlign: 'center' }}>
            <ScrambleHeading text={t.causalChains.heading} />
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 15, marginBottom: 28, textAlign: 'center', maxWidth: 720, lineHeight: 1.7, marginLeft: 'auto', marginRight: 'auto' }}>
            {t.causalChains.subheading}
          </p>
        </Reveal>

        <Reveal from="bottom" delay={1}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <button onClick={() => cycleScenario(-1)} aria-label="Previous scenario" style={arrowStyle}>&larr;</button>

            <div
              className="rfi-glass-flat rfi-glass-solid"
              style={{
                borderRadius: 16, padding: '18px 22px 10px', width: '100%', maxWidth: 720, flex: '0 1 auto',
                animation: anim ? `${anim === 'left' ? 'ccFlipLeft' : 'ccFlipRight'} 1050ms cubic-bezier(0.22,1,0.36,1)` : undefined,
                display: 'flex', flexDirection: 'column',
              }}
            >
              <div style={{ fontSize: 17, color: 'var(--text)', fontWeight: 800, marginBottom: 14, textAlign: 'center', lineHeight: 1.35 }}>
                <span>{current?.title ?? ''}</span>
              </div>

              {/* Stable two-column step card: event on the left, explanation on the right.
                  Detailed icons remain in the timeline below, where they communicate sequence. */}
              <div
                className="cc-step-card"
                style={{
                  border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg2)',
                  padding: '18px 24px', margin: '0 auto 14px', width: '100%', maxWidth: 580, height: 164, boxSizing: 'border-box',
                  textAlign: 'center', backdropFilter: 'blur(2px)',
                  animation: stepAnim ? `${stepAnim === 'left' ? 'ccFlipLeft' : 'ccFlipRight'} 1050ms cubic-bezier(0.22,1,0.36,1)` : undefined,
                }}
              >
                <div className="cc-step-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 1px minmax(0, 1fr)', gap: 24, alignItems: 'center', height: '100%' }}>
                  <div className="cc-step-left" style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
                    <div style={{ fontSize: 20, color: 'var(--text)', fontWeight: 800, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
                      {current ? current.nodes[step] : ''}
                    </div>
                  </div>
                  <div className="cc-step-divider" aria-hidden="true" style={{ width: 1, height: '72%', background: 'rgba(182, 190, 202, 0.28)', justifySelf: 'center' }} />
                  <div className="cc-step-description" style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6, minWidth: 0, overflowWrap: 'anywhere', textAlign: 'center' }}>
                    {current ? stepDescription(current.nodes[step], current.nodes[step + 1]) : ''}
                  </div>
                </div>
              </div>

              {/* Nav buttons (stage) just above the graph */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 2, marginBottom: 4 }}>
                <button onClick={() => goStep(step - 1)} aria-label="Previous step" style={stepArrowStyle}>&larr;</button>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text)', letterSpacing: '0.08em', minWidth: 70, textAlign: 'center' }}>
                  {current ? `${String(step + 1).padStart(2, '0')} / ${String(current.nodes.length).padStart(2, '0')}` : '-- / --'}
                </span>
                <button onClick={() => goStep(step + 1)} aria-label="Next step" style={stepArrowStyle}>&rarr;</button>
              </div>

              {/* Graph flush at very bottom */}
              {current && <ChainGraph nodes={current.nodes} chainIndex={safeScenario} step={step} onStep={goStep} />}
            </div>

            <button onClick={() => cycleScenario(1)} aria-label="Next scenario" style={arrowStyle}>&rarr;</button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
