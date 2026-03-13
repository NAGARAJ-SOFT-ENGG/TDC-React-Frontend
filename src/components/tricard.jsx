import React, { useEffect, useState } from 'react';

const labels = ['In Progress', 'Active', 'Suspend'];

const AnimatedNumber = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 3000; // in ms
    const startTime = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const newValue = Math.floor(progress * target);
      setCount(newValue);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target); // ensure it ends exactly at the target
      }
    };

    requestAnimationFrame(step);
  }, [target]);

  return <>{count}</>;
};

export const TriCard = ({ values, selectedLabel, onSelect }) => {
  return (
    <div className="flex gap-2 mb-4">
      {labels.map((label, i) => {
        const value = values[i] ?? 0;
        const isSelected = selectedLabel === label;

        const baseStyle =
          label === 'In Progress'
            ? 'bg-textWarn'
            : label === 'Active'
            ? 'bg-textActive'
            : 'bg-textInactive';

        const selectedStyle = isSelected ? 'ring-2' : '';

        return (
          <div
            key={label}
            className={`flex-1 p-2 text-center rounded-md cursor-pointer ${baseStyle} ${selectedStyle}`}
            onClick={() => onSelect?.(label)}
          >
            <div className="textSecondary text-white">{label}</div>
            <div className="textPrimary text-white">
              <AnimatedNumber target={value} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
