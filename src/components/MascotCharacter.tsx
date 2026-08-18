function MascotCharacter({ className = "" }: { className?: string }) {
    return (
        <div className={`mascot-float ${className}`}>
            <svg viewBox="0 0 240 260" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Feet */}
                <ellipse cx="108" cy="216" rx="11" ry="7" fill="#3730A3" />
                <ellipse cx="132" cy="216" rx="11" ry="7" fill="#3730A3" />

                {/* Left arm (wing, static, behind body) */}
                <ellipse cx="42" cy="148" rx="18" ry="10" fill="url(#armGradient)" transform="rotate(35 42 148)" />

                {/* Right arm (wing, waving toward bubble, behind body) */}
                <g className="mascot-wave" style={{ transformOrigin: '196px 122px' }}>
                    <ellipse cx="200" cy="112" rx="24" ry="13" fill="url(#armGradient)" transform="rotate(-40 200 112)" />
                </g>

                {/* Antennae */}
                <line x1="95" y1="45" x2="80" y2="18" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" />
                <circle cx="80" cy="13" r="6" fill="#FDE68A" className="mascot-pulse" />

                <line x1="148" y1="45" x2="163" y2="18" stroke="#818CF8" strokeWidth="4" strokeLinecap="round" />
                <circle cx="163" cy="13" r="6" fill="#FDE68A" className="mascot-pulse" />

                {/* Body (rounded blob, egg-shaped, in front of arms) */}
                <ellipse cx="120" cy="130" rx="72" ry="85" fill="url(#bodyGradient)" />

                {/* Head shine */}
                <ellipse cx="93" cy="76" rx="16" ry="11" fill="#FFFFFF" opacity="0.4" />
                <circle cx="150" cy="70" r="4" fill="#FFFFFF" opacity="0.45" />

                {/* Screen / face plate */}
                <rect x="86" y="150" width="68" height="28" rx="10" fill="#EEF2FF" opacity="0.6" />

                {/* Eyes (big round, open, with sparkle) */}
                <circle cx="100" cy="112" r="10" fill="#1E1B4B" />
                <circle cx="140" cy="112" r="10" fill="#1E1B4B" />
                <circle cx="103" cy="108" r="3" fill="#FFFFFF" />
                <circle cx="143" cy="108" r="3" fill="#FFFFFF" />

                {/* Smile */}
                <path d="M 104 128 Q 120 140 136 128" fill="none" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />

                {/* Cheeks */}
                <circle cx="76" cy="124" r="8" fill="#FB7185" opacity="0.5" />
                <circle cx="164" cy="124" r="8" fill="#FB7185" opacity="0.5" />

                {/* Shadow */}
                <ellipse cx="120" cy="252" rx="45" ry="8" fill="#312E81" opacity="0.15" />

                <defs>
                    <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#A5B4FC" />
                        <stop offset="55%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#4338CA" />
                    </linearGradient>
                    <linearGradient id="armGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A5B4FC" />
                        <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}

export default MascotCharacter