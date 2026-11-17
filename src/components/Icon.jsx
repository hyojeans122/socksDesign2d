const paths = {
  sock: <path d="M9 3h8v10l3 3a3 3 0 0 1-1 4l-2 1a4 4 0 0 1-4-1l-7-6a3 3 0 0 1-1-3l4-8ZM9 7h8M6 12l5 4m5-1 3 3" />,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" />,
  upload: <path d="M12 16V4m-5 5 5-5 5 5M4 16v4h16v-4" />,
  check: <path d="m5 12 4 4L19 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  fit: <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />,
  pointer: <path d="m5 3 14 9-7 1-3 7-4-17Z" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
};

function Icon({ name, size = 20, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}

export default Icon;
