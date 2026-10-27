import Link from "next/link";

export default function Footer() {

  return (
    <footer className="bg-background text-muted-foreground py-10 mt-auto border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-foreground font-semibold text-lg mb-4">
              Get to Know Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-primary transition-colors">
                  Press Releases
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="hover:text-primary transition-colors">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-foreground font-semibold text-lg mb-4">
              Connect with Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="#"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  YouTube
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-foreground font-semibold text-lg mb-4">
              Make Money with Us
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/seller" className="hover:text-primary transition-colors">
                  Sell on UrbanClick
                </Link>
              </li>
              <li>
                <Link href="/affiliate" className="hover:text-primary transition-colors">
                  Become an Affiliate
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-primary transition-colors">
                  Advertise Your Products
                </Link>
              </li>
              <li>
                <Link href="/merchant" className="hover:text-primary transition-colors">
                  Merchant Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-foreground font-semibold text-lg mb-4">
              Let Us Help You
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account" className="hover:text-primary transition-colors">
                  Your Account
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary transition-colors">
                  Returns Centre
                </Link>
              </li>
              <li>
                <Link href="/protection" className="hover:text-primary transition-colors">
                  100% Purchase Protection
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">
                  Help
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="flex flex-wrap justify-center gap-4 text-xs mb-4 md:mb-0">
            <Link href="/conditions" className="hover:text-primary transition-colors">
              Conditions of Use & Sale
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Notice
            </Link>
            <Link href="/interest-based-ads" className="hover:text-primary transition-colors">
              Interest-Based Ads
            </Link>
          </div>
          <p className="text-xs">© 2026, UrbanClick | Built by Mahtab</p>
        </div>
      </div>
    </footer>
  );
}
