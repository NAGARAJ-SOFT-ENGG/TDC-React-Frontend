import React, { useEffect, useState } from 'react';

const AnimatedNumber = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const startTime = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const newValue = Math.floor(progress * target);
      setCount(newValue);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target]);

  return <>{count.toLocaleString()}</>;
};

export const CustomerStatCard = ({
  values = {},
  selectedChannel,
  onSelectChannel,
}) => {
  const cards = [
    { label: 'WhatsApp', key: 'whatsapp', bg: 'bg-textWarn' },      // Key to lowercase
    { label: 'Mobile App', key: 'mobileapp', bg: 'bg-textActive' },  // Key to lowercase and combined
    { label: 'Telephonic', key: 'telephonic', bg: 'bg-textInactive' }, // Updated label and key
  ];

  return (
    <div className="flex gap-2 mb-4">
      {cards.map(({ label, key, bg }) => {
        const isSelected = selectedChannel === key;
        return (
          <div
            key={key}
            className={`flex-1 p-2 text-center rounded-md text-white shadow-md cursor-pointer  ${bg} ${
              isSelected ? '' : ''
            }`}
            onClick={() => {
              onSelectChannel?.(key === selectedChannel ? null : key); // All cards now participate in channel selection
            }}
          >
            <div className="textSecondary text-white">{label}</div>
            <div className="textPrimary text-white">
              <AnimatedNumber target={values[key] ?? 0} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
