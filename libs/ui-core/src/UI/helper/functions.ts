type Tags = {
  type: string;
  text: string;
};

type MessageStats = {
  label: string;
  value: number;
};

export const appendOnCreationTagsToFieldsArray = (
  tags: Tags[],
  append: (arg: { text: string }) => void,
  tagType: string
): void => {
  tags
    .filter((tag) => tag.type === tagType)
    .forEach(() => {
      append({ text: "" });
    });
};

export const createProgressLineChartArray = (
  object: { [key: string]: number },
  messageStats: MessageStats[],
  setMessageStats: React.Dispatch<React.SetStateAction<MessageStats[]>>
): void => {
  if (typeof object === "object") {
    const statusOrder = [
      "pending",
      "outForDelivery",
      "failed",
      "delivered",
      "read",
    ];
    const formatLabel = (label: string) => {
   
      if (label === "outForDelivery") {
        return "Delivered to Channel";
      }
      return label
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    };

    const stats = statusOrder.map((status) => {
      const value = object[status] || 0;
      return { label: formatLabel(status), value, quantity: value };
    });

    if (JSON.stringify(stats) !== JSON.stringify(messageStats)) {
      setMessageStats(stats);
    }
  }
};



export const handleExport = async (
  csvData: string,
  name?: string
): Promise<void> => {
  try {
    if (csvData) {
      const url = window.URL.createObjectURL(
        new Blob([csvData], { type: "text/csv" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = name ? `${name}.csv` : "exported_file.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error("Error during file download:", error);
  }
};
