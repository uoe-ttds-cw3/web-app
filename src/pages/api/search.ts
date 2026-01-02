import type { NextApiRequest, NextApiResponse } from "next";

type DeviceResult = {
  id: string;
  name: string;
  manufacturer: string;
  deviceClass: string;
  description: string;
};

type Data = DeviceResult[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Add 1 second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock data
  const mockDevices: DeviceResult[] = [
    {
      id: "1",
      name: "Cardiac Pacemaker",
      manufacturer: "Medtronic Inc.",
      deviceClass: "Class III",
      description:
        "Implantable device that helps control abnormal heart rhythms.",
    },
    {
      id: "2",
      name: "Blood Glucose Monitor",
      manufacturer: "Abbott Laboratories",
      deviceClass: "Class II",
      description: "Portable device for measuring blood glucose concentration.",
    },
    {
      id: "3",
      name: "Surgical Suture",
      manufacturer: "Johnson & Johnson",
      deviceClass: "Class I",
      description:
        "Medical device used to hold body tissues together after injury or surgery.",
    },
  ];

  res.status(200).json(mockDevices);
}
