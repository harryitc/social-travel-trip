import React, { useState, useRef, useEffect } from 'react';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

interface ExpandableTextProps {
    text: string;
    maxLines?: number;
}

export default function ExpandableText({ text, maxLines = 3 }: ExpandableTextProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    // Hàm xử lý highlight mentions
    const renderTextWithMentions = (text: string) => {
        const parts = text.split(/(@\S+)/);
        return parts.map((part, index) => {
            if (part.startsWith('@')) {
                return <span className='dark:text-blue-300 text-blue-600 font-semibold' key={index}>{part}</span>;
            }
            return part;
        });
    };

    useEffect(() => {
        const checkHeight = () => {
            if (textRef.current) {
                const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
                const maxHeight = lineHeight * maxLines;
                setShowButton(textRef.current.scrollHeight > maxHeight);
            }
        };

        checkHeight();
        window.addEventListener('resize', checkHeight);
        return () => window.removeEventListener('resize', checkHeight);
    }, [text, maxLines]);

    return (
        <div>
            <div
                ref={textRef}
                className={`dark:text-stone-200 relative ${!isExpanded ? 'line-clamp-3' : ''}`}
            >
                {renderTextWithMentions(text)}
            </div>
            {showButton && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="font-bold hover:underline text-sm mt-1 flex items-center gap-1 dark:text-blue-400 text-blue-600"
                >
                    {isExpanded ? (
                        <>Thu gọn <UpOutlined className="text-xs" /></>
                    ) : (
                        <>Xem thêm <DownOutlined className="text-xs" /></>
                    )}
                </button>
            )}
        </div>
    );
}