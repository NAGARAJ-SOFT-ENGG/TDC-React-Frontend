import React from 'react';
import {ShieldCheck, Smartphone, Mail} from 'lucide-react';

export const OperatorList = ({ operators = [], onOperatorSelect }) => {

   const getStatusInfo = (activeFlag) => {
    switch (Number(activeFlag)) {
      case 1:
        return 'text-textActive';
      case 2:
        return 'text-textInactive';
      case 3:
        return 'text-textWarn';
      default:
        return 'text-gray-300';
    }
  };

  const getStatusTitle = (activeFlag) => {
    switch (Number(activeFlag)) {
      case 1:
        return 'Active';
      case 2:
        return 'Inactive';
      case 3:
        return 'Warning'; // Or whatever status 3 represents
      default:
        return 'Unknown Status';
    }
  };
  // console.log(operators);

  
  return (
    <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1 scroll-hide">
      {operators.map((op, idx) => (
        <div
          key={idx}
          className="relative bg-white p-4 rounded-md shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-200 ease-in-out cursor-pointer"
          onClick={() => onOperatorSelect && onOperatorSelect(op.operator_mobile, op)}
        >
          {/* Status Icon */}
  <ShieldCheck
            className={`w-4 h-4 absolute top-2 right-2 ${getStatusInfo(op.active_flag)}`}
            title={`Status: ${getStatusTitle(op.active_flag)}`}
          />

          <div className="textPrimary mb-1">{op.operator_business}</div>

         <div className="flex items-center gap-1 textSecondary mb-1">
  <Smartphone className="w-[0.95rem] h-[0.95rem] text-icon" />
  <span className="textSecondary">{op.operator_mobile}</span>
</div>

<div className="flex items-center gap-1 mb-1">
  <Mail className="w-4 h-4 text-icon" />
  <span className="textSecondary">{op.operator_email}</span>
</div>

          <div className="textSecondary">
            {op.operator_name} | {op.operator_phone}
          </div>
        </div>
      ))}
    </div>
  );
};
