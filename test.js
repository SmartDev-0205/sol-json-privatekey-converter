const investors = [
    {
      address: 'BZnaEVxbpTY9L2eaapidcvapMv3J3YegsAV4kDVxX65H',
      amount: 0
    },
    {
      address: '7LmqMDMvDu7JidnFxpvRg5jsVqyG5CEQzeVKEoMHX65H',
      amount: 50000000000
    },
    {
      address: '4BjZSMcDqPoqViHbzkv5UHhTMd21Txb26kJ8AbsCeg2V',
      amount: 2750000000
    },
    {
      address: '4BjZSMcDqPoqViHbzkv5UHhTMd21Txb26kJ8AbsCeg2V',
      amount: 7000000000
    },
    {
      address: '4BjZSMcDqPoqViHbzkv5UHhTMd21Txb26kJ8AbsCeg2V',
      amount: 50000000
    }
  ];
  
  function summarizeInvestors(investors) {
    const summary = {};
  
    investors.forEach(investor => {
      if (summary[investor.address]) {
        // If the address already exists, add the amount
        summary[investor.address] += investor.amount;
      } else {
        // Otherwise, initialize the address with its amount
        summary[investor.address] = investor.amount;
      }
    });
  
    // Convert the summary object back into an array format
    return Object.entries(summary).map(([address, amount]) => ({
      address,
      amount
    }));
  }
  
  const summarizedInvestors = summarizeInvestors(investors);
  console.log(summarizedInvestors);