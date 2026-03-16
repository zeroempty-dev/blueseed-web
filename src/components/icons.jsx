/**
 * Dashboard icons - Lucide React
 * Centralized for consistent professional look
 */
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Map,
  Truck,
  Search,
  Check,
  CheckCircle,
  FileText,
  Building2,
  Settings,
  User,
  Route,
  Handshake,
  PackageCheck,
  MapPin,
  CircleDot,
  Flag,
} from 'lucide-react';

const iconSize = 20;
const iconProps = { size: iconSize, strokeWidth: 2 };

// Named exports for use as elements
export const DashboardIcons = {
  dashboard: <LayoutDashboard {...iconProps} />,
  package: <Package {...iconProps} />,
  loads: <ClipboardList {...iconProps} />,
  map: <Map {...iconProps} />,
  truck: <Truck {...iconProps} />,
  search: <Search {...iconProps} />,
  delivered: <CheckCircle {...iconProps} />,
  posted: <FileText {...iconProps} />,
  business: <Building2 {...iconProps} />,
  admin: <Settings {...iconProps} />,
  driver: <User {...iconProps} />,
  route: <Route {...iconProps} />,
  matched: <Handshake {...iconProps} />,
  shipment: <PackageCheck {...iconProps} />,
  pickup: <MapPin {...iconProps} />,
  inTransit: <CircleDot {...iconProps} />,
  completed: <Flag {...iconProps} />,
  check: <Check {...iconProps} />,
};
