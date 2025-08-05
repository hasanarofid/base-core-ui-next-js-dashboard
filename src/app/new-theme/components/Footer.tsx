'use client';

export default function Footer() {
  return (
    <footer className="content-footer footer bg-footer-theme">
      <div className="container-xxl">
        <div
          className="footer-container d-flex align-items-center justify-content-between py-2 flex-md-row flex-column">
          <div>
            ©
            <script>
              {new Date().getFullYear()}
            </script>
            , made with ❤️ by <a href="https://pixinvent.com" target="_blank" className="fw-semibold">Pixinvent</a>
          </div>
          <div>
            <a href="https://themeforest.net/licenses/standard" className="footer-link me-4" target="_blank"
              >License</a
            >
            <a href="https://1.envato.market/pixinvent_portfolio" target="_blank" className="footer-link me-4"
              >More Themes</a
            >

            <a
              href="https://demos.pixinvent.com/vuexy-html-admin-template/documentation/"
              target="_blank"
              className="footer-link me-4"
              >Documentation</a
            >

            <a href="https://pixinvent.ticksy.com/" target="_blank" className="footer-link d-none d-sm-inline-block"
              >Support</a
            >
          </div>
        </div>
      </div>
    </footer>
  );
} 