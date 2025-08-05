'use client';

export default function DashboardContent() {
  return (
    <div className="content-wrapper">
      {/* Content */}
      <div className="container-xxl flex-grow-1 container-p-y">
        <div className="row">
          {/* Website Analytics */}
          <div className="col-lg-6 mb-4">
            <div
              className="swiper-container swiper-container-horizontal swiper swiper-card-advance-bg"
              id="swiper-with-pagination-cards">
              <div className="swiper-wrapper">
                <div className="swiper-slide">
                  <div className="row">
                    <div className="col-12">
                      <h5 className="text-white mb-0 mt-2">Website Analytics</h5>
                      <small>Total 28.5% Conversion Rate</small>
                    </div>
                    <div className="row">
                      <div className="col-lg-7 col-md-9 col-12 order-2 order-md-1">
                        <h6 className="text-white mt-0 mt-md-3 mb-3">Revenue Sources</h6>
                        <div className="row">
                          <div className="col-6">
                            <ul className="list-unstyled mb-0">
                              <li className="d-flex mb-4 align-items-center">
                                <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">268</p>
                                <p className="mb-0">Direct</p>
                              </li>
                              <li className="d-flex align-items-center mb-2">
                                <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">890</p>
                                <p className="mb-0">Organic</p>
                              </li>
                            </ul>
                          </div>
                          <div className="col-6">
                            <ul className="list-unstyled mb-0">
                              <li className="d-flex mb-4 align-items-center">
                                <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">62</p>
                                <p className="mb-0">Referral</p>
                              </li>
                              <li className="d-flex align-items-center mb-2">
                                <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">1.2k</p>
                                <p className="mb-0">Campaign</p>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-5 col-md-3 col-12 order-1 order-md-2 my-4 my-md-0 text-center">
                        <img
                          src="../../assets/img/illustrations/card-website-analytics-1.png"
                          alt="Website Analytics"
                          width="170"
                          className="card-website-analytics-img" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="swiper-slide">
                  <div className="row">
                    <div className="col-12">
                      <h5 className="text-white mb-0 mt-2">Website Analytics</h5>
                      <small>Total 28.5% Conversion Rate</small>
                    </div>
                    <div className="col-lg-7 col-md-9 col-12 order-2 order-md-1">
                      <h6 className="text-white mt-0 mt-md-3 mb-3">Spending</h6>
                      <div className="row">
                        <div className="col-6">
                          <ul className="list-unstyled mb-0">
                            <li className="d-flex mb-4 align-items-center">
                              <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">12h</p>
                              <p className="mb-0">Spend</p>
                            </li>
                            <li className="d-flex align-items-center mb-2">
                              <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">127</p>
                              <p className="mb-0">Order</p>
                            </li>
                          </ul>
                        </div>
                        <div className="col-6">
                          <ul className="list-unstyled mb-0">
                            <li className="d-flex mb-4 align-items-center">
                              <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">18</p>
                              <p className="mb-0">Order Size</p>
                            </li>
                            <li className="d-flex align-items-center mb-2">
                              <p className="mb-0 fw-semibold me-2 website-analytics-text-bg">2.3k</p>
                              <p className="mb-0">Items</p>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 col-md-3 col-12 order-1 order-md-2 my-4 my-md-0 text-center">
                      <img
                        src="../../assets/img/illustrations/card-website-analytics-2.png"
                        alt="Website Analytics"
                        width="170"
                        className="card-website-analytics-img" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="swiper-pagination swiper-pagination-bullets swiper-pagination-horizontal">
                <span className="swiper-pagination-bullet swiper-pagination-bullet-active"></span>
                <span className="swiper-pagination-bullet"></span>
              </div>
            </div>
          </div>

          {/* Sales Overview */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="card-info">
                    <p className="card-text">Sales Overview</p>
                    <div className="d-flex align-items-end mb-2">
                      <h4 className="card-title mb-0">$42.5k</h4>
                      <small className="text-success ms-2">
                        <i className="ti ti-chevron-up"></i>
                        +18.2%
                      </small>
                    </div>
                  </div>
                  <div className="card-icon">
                    <span className="badge bg-label-primary rounded p-2">
                      <i className="ti ti-trending-up ti-sm"></i>
                    </span>
                  </div>
                </div>
                <div className="progress mt-3" style={{ height: '8px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: '62.2%' }}
                                         aria-valuenow={62.2}
                     aria-valuemin={0}
                     aria-valuemax={100}></div>
                </div>
                <small className="text-muted">You did 62.2% more sales today.</small>
              </div>
            </div>
          </div>

          {/* Revenue Generated */}
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="card-info">
                    <p className="card-text">Revenue Generated</p>
                    <div className="d-flex align-items-end mb-2">
                      <h4 className="card-title mb-0">$97.5k</h4>
                      <small className="text-success ms-2">
                        <i className="ti ti-chevron-up"></i>
                        +12.3%
                      </small>
                    </div>
                  </div>
                  <div className="card-icon">
                    <span className="badge bg-label-success rounded p-2">
                      <i className="ti ti-currency-dollar ti-sm"></i>
                    </span>
                  </div>
                </div>
                <div className="progress mt-3" style={{ height: '8px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: '78.9%' }}
                                         aria-valuenow={78.9}
                     aria-valuemin={0}
                     aria-valuemax={100}></div>
                </div>
                <small className="text-muted">78.9% of target achieved.</small>
              </div>
            </div>
          </div>

          {/* Earning Reports */}
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <div className="card-title m-0">
                  <h5 className="m-0">Earning Reports</h5>
                  <small className="card-subtitle">Weekly Earnings Overview</small>
                </div>
                <div className="dropdown">
                  <button
                    className="btn p-0"
                    type="button"
                    id="earningReportsId"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="earningReportsId">
                    <li><a className="dropdown-item" href="javascript:void(0);">View More</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <h2 className="mb-0 me-2">$468</h2>
                    <small className="text-success">(+4.2%)</small>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-label-primary">+$28.5k</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center">
                      <div className="avatar">
                        <span className="avatar-initial rounded bg-label-primary">
                          <i className="ti ti-trending-up"></i>
                        </span>
                      </div>
                    </div>
                    <div className="card-info">
                      <h5 className="mb-0">Earnings</h5>
                      <small>$545.69</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center">
                      <div className="avatar">
                        <span className="avatar-initial rounded bg-label-success">
                          <i className="ti ti-users"></i>
                        </span>
                      </div>
                    </div>
                    <div className="card-info">
                      <h5 className="mb-0">Profit</h5>
                      <small>$256.34</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex align-items-center">
                      <div className="avatar">
                        <span className="avatar-initial rounded bg-label-danger">
                          <i className="ti ti-shopping-cart"></i>
                        </span>
                      </div>
                    </div>
                    <div className="card-info">
                      <h5 className="mb-0">Expense</h5>
                      <small>$74.19</small>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">Sales Report</span>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown">
                      This Week
                    </button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="javascript:void(0);">Last Week</a></li>
                      <li><a className="dropdown-item" href="javascript:void(0);">Last Month</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support Tracker */}
          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <div className="card-title m-0">
                  <h5 className="m-0">Support Tracker</h5>
                  <small className="card-subtitle">Last 7 Days</small>
                </div>
                <div className="dropdown">
                  <button
                    className="btn p-0"
                    type="button"
                    id="supportTrackerId"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="supportTrackerId">
                    <li><a className="dropdown-item" href="javascript:void(0);">View More</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6 mb-4">
                    <div className="d-flex align-items-center">
                      <div className="avatar">
                        <span className="avatar-initial rounded bg-label-primary">
                          <i className="ti ti-ticket"></i>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0">164</h6>
                        <small>Total Tickets</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 mb-4">
                    <div className="d-flex align-items-center">
                      <div className="avatar">
                        <span className="avatar-initial rounded bg-label-success">
                          <i className="ti ti-check"></i>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0">142</h6>
                        <small>New Tickets</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 mb-4">
                    <div className="d-flex align-items-center">
                      <div className="avatar">
                        <span className="avatar-initial rounded bg-label-warning">
                          <i className="ti ti-clock"></i>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0">28</h6>
                        <small>Open Tickets</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6 mb-4">
                    <div className="d-flex align-items-center">
                      <div className="avatar">
                        <span className="avatar-initial rounded bg-label-info">
                          <i className="ti ti-clock"></i>
                        </span>
                      </div>
                      <div className="ms-3">
                        <h6 className="mb-0">1 Day</h6>
                        <small>Response Time</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <h4 className="mb-0">85%</h4>
                    <small className="text-success">Completed Task</small>
                  </div>
                  <div className="progress" style={{ width: '60%', height: '8px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: '85%' }}
                                           aria-valuenow={85}
                     aria-valuemin={0}
                     aria-valuemax={100}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sales by Countries */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <div className="card-title m-0">
                  <h5 className="m-0">Sales by Countries</h5>
                  <small className="card-subtitle">Monthly Sales Overview</small>
                </div>
                <div className="dropdown">
                  <button
                    className="btn p-0"
                    type="button"
                    id="salesByCountriesId"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="salesByCountriesId">
                    <li><a className="dropdown-item" href="javascript:void(0);">View More</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="avatar">
                      <span className="avatar-initial rounded bg-label-primary">
                        <i className="fi fi-us"></i>
                      </span>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0">United States</h6>
                    <small>$8,567k</small>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-label-success">+25.8%</span>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="avatar">
                      <span className="avatar-initial rounded bg-label-success">
                        <i className="fi fi-br"></i>
                      </span>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0">Brazil</h6>
                    <small>$2,415k</small>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-label-success">+6.2%</span>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="avatar">
                      <span className="avatar-initial rounded bg-label-warning">
                        <i className="fi fi-in"></i>
                      </span>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0">India</h6>
                    <small>$865k</small>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-label-danger">-4.1%</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="avatar">
                      <span className="avatar-initial rounded bg-label-info">
                        <i className="fi fi-au"></i>
                      </span>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0">Australia</h6>
                    <small>$745k</small>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-label-success">+12.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Earning */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="card-info">
                    <p className="card-text">Total Earning</p>
                    <div className="d-flex align-items-end mb-2">
                      <h4 className="card-title mb-0">87%</h4>
                      <small className="text-success ms-2">
                        <i className="ti ti-chevron-up"></i>
                        +25.8%
                      </small>
                    </div>
                  </div>
                  <div className="card-icon">
                    <span className="badge bg-label-primary rounded p-2">
                      <i className="ti ti-trending-up ti-sm"></i>
                    </span>
                  </div>
                </div>
                <div className="progress mt-3" style={{ height: '8px' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: '87%' }}
                                         aria-valuenow={87}
                     aria-valuemin={0}
                     aria-valuemax={100}></div>
                </div>
                <small className="text-muted">You did 87% more sales today.</small>
              </div>
            </div>
          </div>

          {/* Monthly Campaign State */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <div className="card-title m-0">
                  <h5 className="m-0">Monthly Campaign State</h5>
                  <small className="card-subtitle">8.52k Social Visitors</small>
                </div>
                <div className="dropdown">
                  <button
                    className="btn p-0"
                    type="button"
                    id="monthlyCampaignStateId"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                    <i className="ti ti-dots-vertical ti-sm text-muted"></i>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="monthlyCampaignStateId">
                    <li><a className="dropdown-item" href="javascript:void(0);">View More</a></li>
                    <li><a className="dropdown-item" href="javascript:void(0);">Delete</a></li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="avatar">
                      <span className="avatar-initial rounded bg-label-primary">
                        <i className="ti ti-mail"></i>
                      </span>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0">Emails</h6>
                    <small>12,346</small>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-label-success">+0.3%</span>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="avatar">
                      <span className="avatar-initial rounded bg-label-success">
                        <i className="ti ti-eye"></i>
                      </span>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0">Opened</h6>
                    <small>8,734</small>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-label-success">+2.1%</span>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="avatar">
                      <span className="avatar-initial rounded bg-label-warning">
                        <i className="ti ti-click"></i>
                      </span>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0">Clicked</h6>
                    <small>967</small>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-label-danger">-1.2%</span>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center">
                    <div className="avatar">
                      <span className="avatar-initial rounded bg-label-info">
                        <i className="ti ti-users"></i>
                      </span>
                    </div>
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0">Subscribers</h6>
                    <small>345</small>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-label-success">+8.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* / Content */}
    </div>
  );
} 