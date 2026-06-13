function LandingPage({ onSelectRole }) {
  return (
    <div className='landing'>
      <div className='landing-header'>
        <h1>🗳️ CivicPass</h1>
        <p>Blockchain Credential Verification System</p>
        <p>Select your role to continue</p>
      </div>

      <div className='role-cards'>
        {/* Admin Card */}
        <div className='role-card'>
          <div className='icon'>🏛️</div>
          <h2>Admin Portal</h2>
          <p>
            For election administrators. Authorize and manage trusted credential
            issuers. Full system control.
          </p>
          <button className='admin-btn' onClick={() => onSelectRole("admin")}>
            Enter as Admin
          </button>
        </div>

        {/* Issuer Card */}
        <div className='role-card'>
          <div className='icon'>📋</div>
          <h2>Issuer Portal</h2>
          <p>
            For authorized credential issuers. Issue and revoke voter
            eligibility credentials for specific elections.
          </p>
          <button className='issuer-btn' onClick={() => onSelectRole("issuer")}>
            Enter as Issuer
          </button>
        </div>

        {/* Verifier Card */}
        <div className='role-card'>
          <div className='icon'>🔍</div>
          <h2>Verifier Portal</h2>
          <p>
            For poll workers at the polling place. Verify voter credentials and
            check voters in for their election.
          </p>
          <button
            className='verifier-btn'
            onClick={() => onSelectRole("verifier")}
          >
            Enter as Verifier
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
