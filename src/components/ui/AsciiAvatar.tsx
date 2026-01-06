'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '@/hooks';

interface AsciiAvatarProps {
  imageUrl?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  className?: string;
}

/**
 * AsciiAvatar - Displays a terminal-style code graphic or converts images to ASCII art
 * 
 * Features:
 * - SVG terminal graphic with animated cursor (default)
 * - Converts images to ASCII characters (when imageUrl provided)
 * - Interactive character highlighting on mouse hover (ASCII mode)
 * - Retro terminal/CLI aesthetic
 * - Fully responsive and mobile-friendly
 */
export const AsciiAvatar: React.FC<AsciiAvatarProps> = ({
  imageUrl,
  width = 80,
  height = 40,
  fontSize = 10,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [asciiArt, setAsciiArt] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredChar, setHoveredChar] = useState<{ row: number; col: number } | null>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const { isMobile } = useResponsive();

  // Adjust font size for mobile
  const responsiveFontSize = isMobile ? Math.max(6, fontSize * 0.6) : fontSize;

  // ASCII characters from darkest to lightest
  const ASCII_CHARS = '@%#*+=-:. ';
  // Alternative dense set: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ';

  useEffect(() => {
    if (!imageUrl) {
      // Use SVG instead of ASCII art
      setIsLoaded(true);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      // Convert to ASCII
      const ascii: string[] = [];

      for (let y = 0; y < height; y++) {
        let row = '';
        for (let x = 0; x < width; x++) {
          const offset = (y * width + x) * 4;
          const r = pixels[offset];
          const g = pixels[offset + 1];
          const b = pixels[offset + 2];
          const alpha = pixels[offset + 3];

          // Calculate brightness (0-255)
          const brightness = (r + g + b) / 3;

          // Handle transparency
          if (alpha < 128) {
            row += ' ';
          } else {
            // Map brightness to ASCII character
            const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
            row += ASCII_CHARS[ASCII_CHARS.length - 1 - charIndex];
          }
        }
        ascii.push(row);
      }

      setAsciiArt(ascii);
      setIsLoaded(true);
    };

    img.onerror = () => {
      console.error('Failed to load image for ASCII conversion');
      setIsLoaded(true);
    };

    img.src = imageUrl;
  }, [imageUrl, width, height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLPreElement>) => {
    if (!preRef.current) return;

    const rect = preRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate character position
    const charWidth = responsiveFontSize * 0.6; // Monospace character width approximation
    const charHeight = responsiveFontSize * 1.2; // Line height

    const col = Math.floor(x / charWidth);
    const row = Math.floor(y / charHeight);

    if (row >= 0 && row < asciiArt.length && col >= 0 && col < asciiArt[0]?.length) {
      setHoveredChar({ row, col });
    } else {
      setHoveredChar(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredChar(null);
  };

  const getCharColor = (char: string, row: number, col: number): string => {
    // Base color based on character density
    const density = ASCII_CHARS.indexOf(char);

    if (density === -1) return '#858585';

    // Calculate distance from hovered character
    if (hoveredChar) {
      const dx = col - hoveredChar.col;
      const dy = row - hoveredChar.row;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 5;

      if (distance < maxDistance) {
        const influence = 1 - (distance / maxDistance);
        // Highlight nearby characters
        if (influence > 0.7) return '#4ec9b0'; // Bright green
        if (influence > 0.4) return '#569cd6'; // Blue
        if (influence > 0.2) return '#dcdcaa'; // Yellow
      }
    }

    // Default colors based on density
    if (density < 3) return '#d4d4d4'; // Bright
    if (density < 6) return '#a0a0a0'; // Medium
    return '#707070'; // Dark
  };

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <motion.div
          className="text-[#4ec9b0] font-mono text-sm"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Loading ASCII art...
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      className={`ascii-avatar-container relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {!imageUrl ? (
        // SVG Terminal Display
        <motion.div
          className="flex justify-center items-center w-full max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 900 520"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto max-w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <rect width="900" height="520" fill="#0d1117" />

            <rect
              x="100"
              y="60"
              width="700"
              height="360"
              rx="18"
              fill="#161b22"
              stroke="#30363d"
              strokeWidth="3"
            />

            <rect
              x="120"
              y="80"
              width="660"
              height="300"
              rx="12"
              fill="#0d1117"
            />

            <rect
              x="120"
              y="80"
              width="660"
              height="36"
              rx="12"
              fill="#21262d"
            />

            <circle cx="145" cy="98" r="6" fill="#ff5f56" />
            <circle cx="165" cy="98" r="6" fill="#ffbd2e" />
            <circle cx="185" cy="98" r="6" fill="#27c93f" />

            <g
              fontFamily="JetBrains Mono, monospace"
              fontSize="16"
              fill="#c9d1d9"
            >
              <text x="145" y="150">&gt; const developer = {'{'}</text>

              <text x="165" y="180">
                name: <tspan fill="#79c0ff">&quot;Pratik Kamble&quot;</tspan>,
              </text>

              <text x="165" y="210">
                role: <tspan fill="#79c0ff">&quot;Full Stack Developer&quot;</tspan>,
              </text>

              <text x="165" y="240">
                skills:
                <tspan fill="#79c0ff"> [&quot;React&quot;, &quot;Node.js&quot;, &quot;TypeScript&quot;]</tspan>,
              </text>

              <text x="165" y="270">
                passion:
                <tspan fill="#79c0ff"> &quot;Building amazing things&quot;</tspan>
              </text>

              <text x="145" y="300">{'}'};</text>

              <text x="145" y="330">&gt; console.log(developer.passion);</text>

              <text x="145" y="360" fill="#a5d6ff">
                &quot;Building amazing things&quot;
              </text>

              <rect x="460" y="345" width="10" height="20" fill="#58a6ff">
                <animate
                  attributeName="opacity"
                  from="1"
                  to="0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </rect>
            </g>

            <rect
              x="420"
              y="420"
              width="60"
              height="40"
              rx="8"
              fill="#30363d"
            />

            <rect
              x="350"
              y="460"
              width="200"
              height="18"
              rx="9"
              fill="#21262d"
            />
          </svg>

        </motion.div>
      ) : (
        // ASCII Art Display (for image conversion)
        <div className="relative rounded-lg p-4 bg-[#1e1e1e] overflow-x-auto transition-shadow duration-300 max-w-full shadow-lg hover:shadow-[0_0_20px_rgba(0,122,204,0.4)]">
          {/* Scanline effect */}
          {/* <div className="absolute inset-0 pointer-events-none opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="h-px bg-[#4ec9b0]"
              style={{ marginTop: `${i * 5}%` }}
            />
          ))}
        </div> */}

          {/* ASCII Art */}
          <pre
            // ref={preRef}
            className="font-mono leading-tight overflow-x-auto cursor-crosshair select-none max-w-full"
            style={{ fontSize: `${responsiveFontSize}px` }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {asciiArt.map((line, rowIndex) => (
              <motion.div
                key={rowIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.05,
                  delay: rowIndex * 0.02,
                  ease: "easeOut"
                }}
              >
                {line.split('').map((char, colIndex) => (
                  <motion.span
                    key={`${rowIndex}-${colIndex}`}
                    style={{
                      color: getCharColor(char, rowIndex, colIndex),
                      display: 'inline-block'
                    }}
                    animate={{
                      scale: hoveredChar?.row === rowIndex && hoveredChar?.col === colIndex ? 1.3 : 1,
                    }}
                    transition={{ duration: 0.1 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            ))}
          </pre>

          {/* Blinking cursor indicator */}
          <motion.div
            className="absolute bottom-2 right-2 w-2 h-3 bg-[#4ec9b0]"
            animate={{
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Info text */}
          {hoveredChar && (
            <motion.div
              className="absolute top-2 right-2 text-[#4ec9b0] text-xs font-mono bg-[#1e1e1e] px-2 py-1 rounded border border-[#007acc]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              [{hoveredChar.row}, {hoveredChar.col}]
            </motion.div>
          )}
        </div>
      )}

      {/* Terminal-style label - only show for image conversion */}
      {imageUrl && (
        <motion.div
          className="mt-2 text-[#858585] text-xs font-mono text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {width}x{height} ASCII • {asciiArt.length} lines
        </motion.div>
      )}
    </motion.div>
  );
};

export default AsciiAvatar;
