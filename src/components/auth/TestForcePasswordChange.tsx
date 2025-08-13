'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ChangePasswordModal from './ChangePasswordModal';

export default function TestForcePasswordChange() {
  const { user } = useAuth();
  const [showModal, setShowModal] = React.useState(false);

  const testForcePasswordChange = () => {
    console.log('🧪 Testing force password change...');
    console.log('🧪 Current user:', user);
    console.log('🧪 User role:', user?.role);
    console.log('🧪 Force password change:', user?.force_password_change);
    
    if ((user?.role === 'admin_tenant' || user?.role === 'tenant_admin') && user?.force_password_change) {
      console.log('🧪 Should show modal!');
      setShowModal(true);
    } else {
      console.log('🧪 Should NOT show modal');
      alert(`User role: ${user?.role}, Force password change: ${user?.force_password_change}`);
    }
  };

  const handleSuccess = () => {
    console.log('🧪 Password changed successfully in test');
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h3>Test Force Password Change</h3>
      <button 
        className="btn btn-primary"
        onClick={testForcePasswordChange}
      >
        Test Force Password Change Modal
      </button>
      
      <div className="mt-3">
        <strong>Current User Data:</strong>
        <pre className="bg-light p-2 mt-2 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="mt-3">
        <strong>Debug Info:</strong>
        <ul className="list-unstyled">
          <li>Role: <code>{user?.role}</code></li>
          <li>Force Password Change: <code>{user?.force_password_change ? 'true' : 'false'}</code></li>
          <li>Should Show Modal: <code>{((user?.role === 'admin_tenant' || user?.role === 'tenant_admin') && user?.force_password_change) ? 'YES' : 'NO'}</code></li>
        </ul>
      </div>

      <ChangePasswordModal 
        isOpen={showModal} 
        onSuccess={handleSuccess}
      />
    </div>
  );
} 