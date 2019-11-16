import React from 'react';
import LedgerType from './LedgerType';
import HardwareAccountSelect from './HardwareAccountSelect';
import templates from './templates';

const wallets = {
  ledgertype: args => <LedgerType {...args} />,
  hardwareaccountselect: args => <HardwareAccountSelect {...args} />
};

export { wallets, templates };
