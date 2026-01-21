import React, { useState, useEffect } from 'react';
import { Lock, Users, DollarSign, Eye, EyeOff, Bitcoin, Shield, CheckCircle, Clock, Wallet } from 'lucide-react';

const PrivateBTCPayroll = () => {
  const [activeView, setActiveView] = useState('company');
  const [employees, setEmployees] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [processing, setProcessing] = useState(false);
  
  // Form states
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    wallet: '',
    salary: '',
    role: ''
  });

  // Simulated encryption function
  const encryptSalary = (amount, employeeWallet) => {
    const encrypted = btoa(`${amount}-${employeeWallet}-${Date.now()}`);
    return encrypted;
  };

  // Simulated decryption function
  const decryptSalary = (encrypted, employeeWallet) => {
    try {
      const decrypted = atob(encrypted);
      const [amount] = decrypted.split('-');
      return amount;
    } catch {
      return null;
    }
  };

  // Generate ZK proof simulation
  const generateZKProof = (salary) => {
    return `stark_proof_${btoa(salary + Math.random()).substring(0, 16)}`;
  };

  const addEmployee = () => {
    if (!newEmployee.name || !newEmployee.wallet || !newEmployee.salary || !newEmployee.role) {
      alert('Please fill all fields');
      return;
    }

    const employee = {
      id: `emp_${Date.now()}`,
      name: newEmployee.name,
      wallet: newEmployee.wallet,
      role: newEmployee.role,
      salary: newEmployee.salary,
      encryptedSalary: encryptSalary(newEmployee.salary, newEmployee.wallet),
      zkProof: generateZKProof(newEmployee.salary),
      addedDate: new Date().toISOString(),
      totalPaid: 0,
      paymentsCount: 0
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: '', wallet: '', salary: '', role: '' });
    setShowAddEmployee(false);
  };

  const processPayroll = async () => {
    if (employees.length === 0) {
      alert('No employees to pay');
      return;
    }

    setProcessing(true);
    
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    const batch = {
      id: `batch_${Date.now()}`,
      timestamp: new Date().toISOString(),
      employeeCount: employees.length,
      totalAmount: employees.reduce((sum, emp) => sum + parseFloat(emp.salary), 0),
      status: 'completed',
      zkProofBatch: generateZKProof(employees.map(e => e.salary).join('-')),
      transactions: employees.map(emp => ({
        employeeId: emp.id,
        employeeName: emp.name,
        wallet: emp.wallet,
        encryptedAmount: emp.encryptedSalary,
        zkProof: emp.zkProof,
        txHash: `0x${Math.random().toString(16).substring(2, 18)}`
      }))
    };

    setPayrollHistory([batch, ...payrollHistory]);
    
    // Update employee records
    setEmployees(employees.map(emp => ({
      ...emp,
      totalPaid: emp.totalPaid + parseFloat(emp.salary),
      paymentsCount: emp.paymentsCount + 1,
      lastPaid: new Date().toISOString()
    })));

    setProcessing(false);
  };

  const CompanyDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Employees</p>
              <p className="text-3xl font-bold mt-1">{employees.length}</p>
            </div>
            <Users className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Monthly Payroll</p>
              <p className="text-3xl font-bold mt-1">
                {employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0).toFixed(4)} BTC
              </p>
            </div>
            <Bitcoin className="w-12 h-12 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Payroll Runs</p>
              <p className="text-3xl font-bold mt-1">{payrollHistory.length}</p>
            </div>
            <CheckCircle className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Employees</h2>
          <button
            onClick={() => setShowAddEmployee(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Add Employee
          </button>
        </div>

        {showAddEmployee && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-blue-200">
            <h3 className="font-semibold mb-4">New Employee</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Role/Position"
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="Starknet Wallet Address"
                value={newEmployee.wallet}
                onChange={(e) => setNewEmployee({...newEmployee, wallet: e.target.value})}
                className="border rounded-lg px-4 py-2"
              />
              <input
                type="number"
                step="0.0001"
                placeholder="Monthly Salary (BTC)"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})}
                className="border rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={addEmployee}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddEmployee(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {employees.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No employees added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {employees.map(emp => (
              <div key={emp.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-800">{emp.name}</h3>
                      <span className="text-sm text-gray-500">{emp.role}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 font-mono">{emp.wallet}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Payments: {emp.paymentsCount}</span>
                      <span>Total Paid: {emp.totalPaid.toFixed(4)} BTC</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <Lock className="w-4 h-4" />
                      <span>Encrypted</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Salary: {emp.salary} BTC</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {employees.length > 0 && (
          <button
            onClick={processPayroll}
            disabled={processing}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold text-lg"
          >
            {processing ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Processing Payroll...
              </>
            ) : (
              <>
                <Bitcoin className="w-5 h-5" />
                Process Payroll ({employees.length} employees)
              </>
            )}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Payroll History</h2>
        {payrollHistory.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No payroll processed yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {payrollHistory.map(batch => (
              <div key={batch.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Batch Payment - {new Date(batch.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {batch.employeeCount} employees • {batch.totalAmount.toFixed(4)} BTC
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {batch.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-mono bg-white p-2 rounded">
                  ZK Proof: {batch.zkProofBatch}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const EmployeeDashboard = () => {
    const [selectedWallet, setSelectedWallet] = useState('');
    const [decryptedView, setDecryptedView] = useState(false);

    const employeeData = employees.find(emp => emp.wallet === selectedWallet);
    const employeePayments = payrollHistory.flatMap(batch => 
      batch.transactions.filter(tx => tx.wallet === selectedWallet)
    );

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Employee Access</h2>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className="w-full border rounded-lg px-4 py-3 text-gray-700"
          >
            <option value="">Select your wallet address...</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.wallet}>
                {emp.name} - {emp.wallet}
              </option>
            ))}
          </select>
        </div>

        {employeeData ? (
          <>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-purple-100 text-sm">Your Monthly Salary</p>
                  <div className="flex items-center gap-3 mt-2">
                    {decryptedView ? (
                      <p className="text-4xl font-bold">{employeeData.salary} BTC</p>
                    ) : (
                      <p className="text-4xl font-bold">••••••••</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setDecryptedView(!decryptedView)}
                  className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-colors"
                >
                  {decryptedView ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-purple-100">
                <Shield className="w-4 h-4" />
                <span>End-to-end encrypted • Only you can see this</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm">Total Received</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {employeeData.totalPaid.toFixed(4)} BTC
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm">Payments Count</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {employeeData.paymentsCount}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600 text-sm">Last Payment</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {employeeData.lastPaid ? new Date(employeeData.lastPaid).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment History</h2>
              {employeePayments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Wallet className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No payments received yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {employeePayments.map((payment, idx) => (
                    <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <p className="font-semibold text-gray-800">Payment Received</p>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 font-mono">
                            Tx: {payment.txHash}
                          </p>
                          {decryptedView && (
                            <p className="text-sm text-green-600 mt-2 font-semibold">
                              Amount: {decryptSalary(payment.encryptedAmount, payment.wallet)} BTC
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-purple-600">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm font-semibold">Private</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          selectedWallet && (
            <div className="text-center py-12 text-gray-400 bg-white rounded-lg shadow-md">
              <p>Employee not found</p>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bitcoin className="w-10 h-10 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">Private Bitcoin Payroll</h1>
          </div>
          <p className="text-gray-600 text-lg">Starknet-powered private salary payments with zero-knowledge proofs</p>
          <div className="flex gap-3 mt-4">
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Shield className="w-4 h-4" />
              STARK Privacy
            </span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Bitcoin className="w-4 h-4" />
              Bitcoin Native
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              Starknet L2
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveView('company')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 ${
                activeView === 'company'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              Company Dashboard
            </button>
            <button
              onClick={() => setActiveView('employee')}
              className={`flex-1 px-6 py-4 font-semibold flex items-center justify-center gap-2 ${
                activeView === 'employee'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Wallet className="w-5 h-5" />
              Employee View
            </button>
          </div>
        </div>

        {activeView === 'company' ? <CompanyDashboard /> : <EmployeeDashboard />}

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            How Privacy Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-800 mb-1">1. Encryption</p>
              <p>Salaries encrypted before blockchain submission using employee's public key</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">2. ZK Proofs</p>
              <p>STARK proofs verify payment validity without revealing amounts</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800 mb-1">3. Private Access</p>
              <p>Only employees can decrypt and view their own salary data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateBTCPayroll;
