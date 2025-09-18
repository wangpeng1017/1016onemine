# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **Mine Safety Monitoring System** frontend demo application built with React + TypeScript + Ant Design. The application provides a comprehensive monitoring interface for various mining sensors and safety equipment, featuring real-time data visualization, device management, and alarm handling.

## Core Technologies & Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript 4.9
- **UI Framework**: Ant Design 5.x (with Chinese locale)
- **Routing**: React Router 6
- **Charts**: ECharts with echarts-for-react
- **Build Tool**: Create React App

### Application Architecture

The application follows a **feature-based modular architecture**:

```
src/
├── layouts/MainLayout.tsx      # Main application shell with sidebar navigation
├── pages/                      # Feature-based page components
│   ├── Home.tsx               # Dashboard with embedded Luciad map
│   ├── MonitoringData.tsx     # Multi-sensor data visualization hub
│   ├── DeviceManagement.tsx   # CRUD for monitoring devices
│   ├── AlarmRecords.tsx       # Alert management system
│   ├── monitoring/            # Individual sensor type pages
│   │   ├── SurfaceDisplacement.tsx
│   │   ├── CrackGauge.tsx
│   │   └── ...
│   └── ...
├── components/                 # Reusable components
│   ├── GISMap.tsx             # ECharts-based coordinate mapping
│   └── RiskGISMap.tsx         # Risk zone visualization
└── App.tsx                    # Route configuration & global providers
```

### Key Architectural Patterns

1. **Layout-Page Structure**: `MainLayout` provides consistent navigation wrapper for all pages
2. **Tab-Based Data Organization**: Complex pages like `MonitoringData` use Ant Design Tabs for different sensor types
3. **Mock Data Strategy**: All components use in-component mock data generators for demonstration
4. **Status-Driven UI**: Consistent status mapping (normal/warning/danger) across all monitoring components
5. **Chart Integration**: ECharts options are generated programmatically based on sensor type

## Common Development Commands

### Local Development
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start

# Build production bundle
npm run build

# Run tests
npm test

# Eject from CRA (avoid unless necessary)
npm run eject
```

### Production Deployment
```bash
# Build and serve locally to preview
npm run build
npx serve -s build

# Deploy to Vercel (auto-detects CRA configuration)
vercel --prod
```

## Working with Monitoring Data

### Adding New Sensor Types

1. **Create sensor-specific page** in `src/pages/monitoring/`
2. **Add route** in `App.tsx` routes configuration
3. **Update navigation** in `MainLayout.tsx` menuItems
4. **Add tab entry** in `MonitoringData.tsx` if needed

### Data Structure Conventions

All sensor data follows consistent interfaces:
```typescript
interface MonitoringRecord {
  key: string;
  time: string;           // ISO format timestamp
  value: number;          // Primary sensor reading
  unit: string;           // Measurement unit (mm, kPa, etc.)
  status: 'normal' | 'warning' | 'danger';
}
```

Device records use:
```typescript
interface Device {
  id: string;             // Unique device identifier
  name: string;           // Human-readable name
  type: string;           // Device category
  location: string;       // Physical location description
  status: 'online' | 'offline' | 'maintenance';
  batteryLevel?: number;  // 0-100 percentage
  signalStrength?: number;// 0-100 percentage
}
```

## GIS Integration Notes

### Map Components
- **Home page**: Embeds external Luciad map editor via iframe
- **GISMap component**: ECharts-based coordinate plotting for monitoring points
- **RiskGISMap component**: Specialized risk zone visualization with WKT polygon support

### Coordinate System
- Uses **WGS84 decimal degrees** (longitude, latitude format)
- Sample coordinates center around Xinjiang region (87.6°E, 43.8°N)
- Risk zones support WKT POLYGON format for boundary definition

## UI Patterns & Conventions

### Status Color Coding
```typescript
const statusColors = {
  normal: '#52c41a',    // Green
  warning: '#faad14',   // Orange/Yellow
  danger: '#ff4d4f',    // Red
  online: '#3f8600',    // Dark green
  offline: '#ff4d4f',   // Red
  maintenance: '#faad14' // Orange
};
```

### Page Structure Pattern
Most pages follow this consistent layout:
1. **Page title** with descriptive header
2. **Statistics overview** using Ant Design Statistic cards
3. **Filter controls** (Select, DatePicker, Search inputs)
4. **Main content area** (Tables, Charts, or Tabs)
5. **Action buttons** (Add, Edit, Delete, Export)

### Modal Usage
- **Detail views**: Use Modal with Descriptions component
- **Forms**: Use Modal with Form component and validation
- **Confirmations**: Use Modal.confirm for destructive actions

## Chart Configuration

### ECharts Integration
Charts are configured using reactive options that update based on:
- **Sensor type**: Determines Y-axis units and data ranges
- **Time range**: Controls X-axis scale and data points
- **Status filtering**: Affects point colors and visibility

Example pattern:
```typescript
const generateChartData = (sensorType: string) => ({
  title: { text: getChartTitle(sensorType) },
  yAxis: { name: getYAxisName(sensorType) },
  series: [{
    data: mockDataGenerator(sensorType),
    itemStyle: { color: getStatusColor() }
  }]
});
```

## Development Workflow

### Adding New Features
1. **Create page component** following existing patterns
2. **Add mock data generators** for demonstration
3. **Update routing** in App.tsx
4. **Add navigation entry** in MainLayout.tsx
5. **Test responsive behavior** across screen sizes

### Modifying Existing Features
1. **Maintain data interface compatibility** when changing structures
2. **Update all dependent components** when changing shared utilities
3. **Test cross-sensor type consistency** for monitoring pages
4. **Preserve status mapping** across modifications

### Integration Considerations
- **API Integration**: Replace mock data generators with actual API calls
- **Real-time Updates**: Consider WebSocket integration for live sensor data
- **Authentication**: Add user login/permissions when moving beyond demo
- **Data Persistence**: Replace in-memory state with proper state management

## Testing & Quality

### Current Test Setup
- Uses Create React App's built-in Jest + React Testing Library
- Test files should follow `*.test.tsx` or `*.spec.tsx` naming
- Run tests with `npm test`

### Code Quality
- TypeScript strict mode enabled for type safety
- ESLint configured via CRA defaults
- Ant Design components provide built-in accessibility features

## Deployment Configuration

### Vercel Deployment
- **Auto-detection**: Vercel automatically recognizes CRA projects
- **Build settings**: Uses `npm run build` → `build/` directory
- **SPA routing**: Properly configured for client-side routing
- **Static assets**: Optimized and cached automatically

### Environment Variables
For production deployments, configure:
```bash
REACT_APP_API_BASE_URL=<your-api-endpoint>
REACT_APP_MAP_TOKEN=<luciad-map-token>
REACT_APP_VERSION=1.0.0
```

## Performance Notes

### Optimization Strategies
- **ECharts**: Use `notMerge: false` for incremental updates on real-time data
- **Table Pagination**: Implemented for large datasets in device management
- **Image Assets**: Minimal external dependencies, relies on Ant Design icons
- **Bundle Size**: Monitor with `npm run build` analyzer warnings

### Real-world Scaling
- Consider **virtual scrolling** for large sensor data tables
- Implement **data aggregation** for historical chart displays  
- Add **caching layer** for frequently accessed device information
- Use **code splitting** for lazy-loading monitoring type pages

## Support Resources

- **Ant Design Documentation**: https://ant.design/components/overview/
- **ECharts Configuration**: https://echarts.apache.org/en/option.html
- **React Router**: https://reactrouter.com/en/main
- **TypeScript Reference**: https://www.typescriptlang.org/docs/
