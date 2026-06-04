import { $ } from '../utils/dom.js';

export function renderFooter() {
  const footerContainer = $('#footer-container');
  if (!footerContainer) return;

  footerContainer.className = "bg-canvas-parchment border-t border-neutral-200 py-section text-ink-muted80";
  footerContainer.innerHTML = `
    <div class="max-w-[1440px] mx-auto px-4 md:px-8">

      <!-- Disclaimer / Notes section -->
      <section class="text-fine-print text-neutral-400 border-b border-neutral-200 pb-lg mb-lg leading-relaxed">
        <p class="mb-xs">1. Chương trình thu cũ đổi mới (Trade-in) áp dụng cho các dòng điện thoại thuộc danh sách được hỗ trợ. Giá trị quy đổi thực tế có thể thay đổi tùy thuộc vào tình trạng máy cũ được đánh giá trực tiếp tại cửa hàng.</p>
        <p class="mb-xs">2. Trả góp 0% lãi suất qua thẻ tín dụng liên kết của hơn 25 ngân hàng hoặc thông qua công ty tài chính với thủ tục duyệt hồ sơ trực tiếp chỉ trong 15 phút.</p>
        <p>3. Hình ảnh sản phẩm và nội dung hiển thị trên trang web chỉ mang tính chất mô phỏng minh họa cho phiên bản thử nghiệm giao diện của AI Agent.</p>
      </section>

      <!-- Footer Columns Grid -->
      <section class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-lg text-dense-link mb-xl">

        <!-- Col 1 -->
        <div class="flex flex-col">
          <h4 class="text-caption-strong text-ink mb-sm uppercase tracking-wider">Khám phá</h4>
          <a href="products.html" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Điện thoại</a>
          <a href="products.html?category=laptops" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Laptops</a>
          <a href="products.html?category=accessories" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Phụ kiện</a>
          <a href="products.html?category=featured" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Sản phẩm nổi bật</a>
        </div>

        <!-- Col 2 -->
        <div class="flex flex-col">
          <h4 class="text-caption-strong text-ink mb-sm uppercase tracking-wider">Dịch vụ HoangPhanStore</h4>
          <a href="#trade-in-section" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Thu cũ đổi mới</a>
          <a href="#" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Bảo hành Care+</a>
          <a href="#" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Giao hàng hỏa tốc</a>
          <a href="#" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Trả góp 0%</a>
        </div>

        <!-- Col 3 -->
        <div class="flex flex-col">
          <h4 class="text-caption-strong text-ink mb-sm uppercase tracking-wider">Tài khoản</h4>
          <a href="#" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Quản lý đơn hàng</a>
          <a href="cart.html" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Giỏ hàng cá nhân</a>
          <a href="#" class="hover:text-primary transition-colors text-caption-apple py-[2px]">Danh sách yêu thích</a>
        </div>

        <!-- Col 4 -->
        <div class="flex flex-col col-span-2 lg:col-span-2">
          <h4 class="text-caption-strong text-ink mb-sm uppercase tracking-wider">Về chúng tôi</h4>
          <p class="text-caption-apple text-neutral-500 mb-xs leading-relaxed">
            HoangPhanStore là chuỗi cửa hàng ủy quyền cung cấp các dòng điện thoại, máy tính và phụ kiện cao cấp hàng đầu Việt Nam. Thiết kế tinh giản, tối ưu trải nghiệm khách hàng.
          </p>
          <p class="text-caption-apple text-neutral-500">
            Địa chỉ: 123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh<br>
            Hotline: 1900 1234 (8:00 - 21:00)
          </p>
        </div>

      </section>

      <!-- Legal / Copyright Bottom Row -->
      <section class="border-t border-neutral-200 pt-lg flex flex-col md:flex-row justify-between items-center text-fine-print text-neutral-400 gap-md">
        <div>
          Bản quyền © 2026 HoangPhanStore. Tất cả các quyền được bảo lưu. Giao diện thiết kế theo phong cách Apple.
        </div>
        <div class="flex items-center gap-md">
          <a href="#" class="hover:underline">Chính sách bảo mật</a>
          <span>|</span>
          <a href="#" class="hover:underline">Chính sách bán hàng</a>
          <span>|</span>
          <a href="#" class="hover:underline">Điều khoản sử dụng</a>
        </div>
      </section>

    </div>
  `;
}
