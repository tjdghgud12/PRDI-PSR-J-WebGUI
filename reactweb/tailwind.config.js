/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        /* % size */
        '1/20': '5%',
        '1/16': '6.25%',
        '1/11': '9.09%',
        '1/8': '12.5%',
        '1/5': '20%',
        '1/10': '10%',
        '1/7': '14.3%',
        '3/10': '30%',
        '7/10': '70%',
        '8/10': '80%',
        '7/8' : '87.5%',
        '9/10': '90%',
        '15/100': '43%',
        '43/100': '43%',
        '45/100': '45%',
        '55/100': '55%',
        '95/100': '95%',
        'userMain': '89%',
        /* px Size */
        '1px' : '1px',
        'm': '15px',
        '1.5px': '1.5px',
        '3px': '3px',
        '13px': '13px',
      },
      colors: {
        'gold': '#f7f700'
      },
      fontFamily: {
        'register' : 'Arial',
      },
      fontSize: {
        '13px' : '13px',
      },
    },
  },
  plugins: [],
}
