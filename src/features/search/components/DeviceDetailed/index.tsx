import { Device } from "../DeviceSummaryCard";

type DeviceDetailedProps = {
  device: Device;
};

export const DeviceDetailed = ({ device }: DeviceDetailedProps) => {
  return (
    <div>
      <p>{device.id}</p>
      <p>{device.name}</p>
    </div>
  );
};
