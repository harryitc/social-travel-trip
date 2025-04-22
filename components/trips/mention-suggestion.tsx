'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

type Member = {
  id: string;
  name: string;
  avatar: string;
};

type MentionSuggestionProps = {
  members: Member[];
  query: string;
  position: { top: number; left: number };
  onSelect: (member: Member | { id: 'all'; name: 'all'; avatar: '' }) => void;
};

export function MentionSuggestion({ members, query, position, onSelect }: MentionSuggestionProps) {
  const [filteredMembers, setFilteredMembers] = useState<(Member | { id: 'all'; name: 'all'; avatar: '' })[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Always include @all option
    const allOption = { id: 'all', name: 'all', avatar: '' };

    // Filter members based on query
    const filtered = query.trim() === ''
      ? [allOption, ...members]
      : [
          ...(allOption.name.includes(query.toLowerCase()) ? [allOption] : []),
          ...members.filter(member =>
            member.name.toLowerCase().includes(query.toLowerCase()) ||
            member.id.includes(query)
          )
        ];

    // Sort results to prioritize name matches over ID matches
    filtered.sort((a, b) => {
      // Keep @all at the top
      if (a.id === 'all') return -1;
      if (b.id === 'all') return 1;

      // Prioritize exact name matches
      const aNameMatch = a.name.toLowerCase().includes(query.toLowerCase());
      const bNameMatch = b.name.toLowerCase().includes(query.toLowerCase());

      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;

      // Default sort by name
      return a.name.localeCompare(b.name);
    });

    setFilteredMembers(filtered);
    setSelectedIndex(0);
  }, [members, query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!filteredMembers.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % filteredMembers.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredMembers.length) % filteredMembers.length);
          break;
        case 'Enter':
        case 'Tab':
          e.preventDefault();
          onSelect(filteredMembers[selectedIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          // Close suggestion by selecting nothing
          onSelect({ id: '', name: '', avatar: '' });
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredMembers, selectedIndex, onSelect]);

  // Scroll selected item into view
  useEffect(() => {
    if (containerRef.current) {
      const selectedElement = containerRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (filteredMembers.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute z-50 bg-background border rounded-md shadow-md w-64 max-h-60 overflow-y-auto"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="p-1 space-y-1">
        {filteredMembers.map((member, index) => (
          <div
            key={member.id}
            data-index={index}
            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
              index === selectedIndex ? 'bg-secondary' : 'hover:bg-secondary/50'
            }`}
            onClick={() => onSelect(member)}
          >
            {member.id === 'all' ? (
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            ) : (
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name[0]}</AvatarFallback>
              </Avatar>
            )}

            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {member.id === 'all' ? 'Tất cả mọi người' : member.name}
              </span>
              {member.id !== 'all' && (
                <span className="text-xs text-muted-foreground">ID: {member.id}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
