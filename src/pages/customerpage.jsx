import React, { useState, useEffect } from 'react';
import {
  CustomerStatCard, CustomerTable, CustomerOnboardingForm,
  AnimatedTabPanel,
  Button
} from '@components';
import { FaSearch } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchAssociatedCustomers } from '@services';
import { useAuth } from '@hooks';
import { Search, Plus, X } from 'lucide-react';

export const CustomersPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [customerSummary, setCustomerSummary] = useState({ mobile_count: 0, whatsapp_count: 0, telephonic_count: 0 });

  const { authData } = useAuth();
  const operatorMobile = authData?.operator_mobile;

  useEffect(() => {
    const loadCustomers = async () => {
      if (!operatorMobile) {
        setError("Operator mobile not available.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const res = await fetchAssociatedCustomers(operatorMobile);
        setCustomers(res?.customers || []);
        setCustomerSummary(res?.summary || { mobile_count: 0, whatsapp_count: 0, telephonic_count: 0 }); // Store summary
      } catch (err) {
        setError(err.message || "Failed to fetch customers.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, [operatorMobile, refreshTrigger]);

  const handleOnboardSuccess = () => setRefreshTrigger(prev => prev + 1);
  const triggerCustomerListRefresh = () => setRefreshTrigger(prev => prev + 1);

  const filteredCustomers = customers.filter((cust) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      cust.customer_name?.toLowerCase().includes(term) ||
      cust.customer_mobile?.includes(term) ||
      cust.operator_mobile?.includes(term);

    const matchesChannel = selectedChannel ? cust.channel?.toLowerCase() === selectedChannel.toLowerCase() : true;

    return matchesSearch && matchesChannel;
  });

  // if (isLoading) return <div className="p-4 text-center"></div>;
  if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full">
        <div className='flex justify-between mb-4 mt-2'>
          <div><h2 className="textPrimary font-bold text-xl mb-4">Customers</h2></div>
          <div>
            <Button onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? 'x Close' : '+ Add Customers'}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2 gap-4 flex-wrap">
          <motion.div className="flex-grow max-w-full">
            <CustomerStatCard
              values={{
                whatsapp: customerSummary.whatsapp_count,
                mobileapp: customerSummary.mobile_count,
                telephonic: customerSummary.telephonic_count
              }}
              selectedChannel={selectedChannel}
              onSelectChannel={setSelectedChannel}
            />
          </motion.div>

          <div className="flex items-center gap-2 relative">
            <motion.input
              type="text"
              placeholder="Search"
              className="border border-gray-300 p-2 rounded-l-md focus:outline-none focus:border-primary font-secondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              initial={{ width: 0, opacity: 0 }}
              animate={searchOpen ? { width: 200, opacity: 1 } : { width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 1 }}
            />

            {/* Search toggle button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-icon rounded-r-md hover:bg-primary-dark transition flex items-center justify-center"
              aria-label="Toggle search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Add / Close toggle button */}
            {/* <button
              className="text-icon hover:text-primary-dark transition ml-3"
              aria-label="Toggle Form"
              onClick={() => setShowForm(prev => !prev)}
            >
              {showForm ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
            </button> */}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showForm ? (
            <AnimatedTabPanel key="customer-form">
              <CustomerOnboardingForm onSaveSuccess={handleOnboardSuccess} />
            </AnimatedTabPanel>
          ) : (
            <AnimatedTabPanel key="customer-table">
              <CustomerTable
                customers={filteredCustomers}
                onDataNeedsRefresh={triggerCustomerListRefresh}
              />
            </AnimatedTabPanel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
