'use client'

export default function CRMStats() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$42.5k',
      change: '+18.2%',
      isPositive: true,
      icon: 'ti ti-currency-dollar'
    },
    {
      title: 'Leads',
      value: '1.2k',
      change: '+12.5%',
      isPositive: true,
      icon: 'ti ti-users'
    },
    {
      title: 'Orders',
      value: '6,440',
      change: '+8.7%',
      isPositive: true,
      icon: 'ti ti-shopping-cart'
    },
    {
      title: 'Conversion',
      value: '28.5%',
      change: '+2.1%',
      isPositive: true,
      icon: 'ti ti-chart-bar'
    }
  ]

  return (
    <div className="row">
      {stats.map((stat, index) => (
        <div key={index} className="col-lg-3 col-md-6 col-12 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div className="card-info">
                  <p className="card-text">{stat.title}</p>
                  <div className="d-flex align-items-end mt-2">
                    <h4 className="card-title mb-0 me-2">{stat.value}</h4>
                    <small className={`text-${stat.isPositive ? 'success' : 'danger'} fw-semibold`}>
                      {stat.change}
                    </small>
                  </div>
                </div>
                <div className="avatar">
                  <div className="avatar-initial rounded bg-label-primary">
                    <i className={`${stat.icon} ti-sm`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 