/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        // Màu sắc theo Apple Design Tokens
        primary: {
          DEFAULT: '#0066cc', // Action Blue
          focus: '#0071e3',   // Focus Blue
          dark: '#2997ff',    // Sky Link Blue
        },
        ink: {
          DEFAULT: '#1d1d1f', // Near-Black Ink
          muted80: '#333333', // Ink Muted 80
          muted48: '#7a7a7a', // Ink Muted 48
        },
        canvas: {
          DEFAULT: '#ffffff', // Pure White
          parchment: '#f5f5f7', // Parchment
        },
        surface: {
          pearl: '#fafafc', // Pearl Button
          tile1: '#272729', // Near-Black Tile 1
          tile2: '#2a2a2c', // Near-Black Tile 2
          tile3: '#252527', // Near-Black Tile 3
          black: '#000000', // Pure Black
          translucent: 'rgba(210, 210, 215, 0.64)', // Translucent Chip
        },
        hairline: '#e0e0e0',
        divider: 'rgba(0, 0, 0, 0.04)',
      },
      fontFamily: {
        display: ['SF Pro Display', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        text: ['SF Pro Text', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        // Tỷ lệ typography
        'hero-display': ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px', fontWeight: '600' }],
        'display-lg': ['40px', { lineHeight: '1.1', letterSpacing: '0', fontWeight: '600' }],
        'display-md': ['34px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '600' }],
        'lead': ['28px', { lineHeight: '1.14', letterSpacing: '0.196px', fontWeight: '400' }],
        'lead-airy': ['24px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '300' }],
        'tagline': ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '600' }],
        'body-strong': ['17px', { lineHeight: '1.24', letterSpacing: '-0.374px', fontWeight: '600' }],
        'body-apple': ['17px', { lineHeight: '1.47', letterSpacing: '-0.374px', fontWeight: '400' }],
        'dense-link': ['17px', { lineHeight: '2.41', letterSpacing: '0', fontWeight: '400' }],
        'caption-apple': ['14px', { lineHeight: '1.43', letterSpacing: '-0.224px', fontWeight: '400' }],
        'caption-strong': ['14px', { lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '600' }],
        'button-large': ['18px', { lineHeight: '1.0', letterSpacing: '0', fontWeight: '300' }],
        'button-utility': ['14px', { lineHeight: '1.29', letterSpacing: '-0.224px', fontWeight: '400' }],
        'fine-print': ['12px', { lineHeight: '1.0', letterSpacing: '-0.12px', fontWeight: '400' }],
        'micro-legal': ['10px', { lineHeight: '1.3', letterSpacing: '-0.08px', fontWeight: '400' }],
        'nav-link': ['12px', { lineHeight: '1.0', letterSpacing: '-0.12px', fontWeight: '400' }],
      },
      borderRadius: {
        'xs': '5px',
        'sm': '8px',
        'md': '11px',
        'lg': '18px',
        'pill': '9999px',
      },
      spacing: {
        'xxs': '4px',
        'xs': '8px',
        'sm': '12px',
        'md': '17px',
        'lg': '24px',
        'xl': '32px',
        'xxl': '48px',
        'section': '80px',
      },
      boxShadow: {
        // Chỉ duy nhất bóng đổ này cho ảnh sản phẩm trên bề mặt
        'product': '3px 5px 30px 0px rgba(0, 0, 0, 0.22)',
      }
    },
  },
  plugins: [],
}
