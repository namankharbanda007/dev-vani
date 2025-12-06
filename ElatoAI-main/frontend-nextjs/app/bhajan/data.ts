export interface Track {
    id: string;
    title: string;
    artist: string;
    src: string; // URL to the mp3 file
    duration: string;
    cover?: string; // Optional cover art URL
}

export const bhajans: Track[] = [
    {
        id: '1',
        title: 'Shri Hanuman Chalisa',
        artist: 'Hariharan',
        src: 'https://archive.org/download/HanumanChalisa_201406/Hanuman%20Chalisa.mp3', // Public domain/placeholder
        duration: '9:45',
        cover: 'https://images.unsplash.com/photo-1581888363372-2d1222477543?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '2',
        title: 'Achyutam Keshavam',
        artist: 'Vikram Hazra',
        src: 'https://archive.org/download/AchyutamKeshavam/Achyutam%20Keshavam.mp3',
        duration: '5:30',
        cover: 'https://images.unsplash.com/photo-1623946633649-76e66f85233e?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '3',
        title: 'Om Jai Jagdish Hare',
        artist: 'Anuradha Paudwal',
        src: 'https://archive.org/download/OmJaiJagdishHare_201606/Om%20Jai%20Jagdish%20Hare.mp3',
        duration: '6:15',
        cover: 'https://images.unsplash.com/photo-1563204886-368623419354?q=80&w=200&auto=format&fit=crop'
    },
    {
        id: '4',
        title: 'Raghupati Raghav Raja Ram',
        artist: 'Various',
        src: 'https://archive.org/download/RaghupatiRaghavRajaRam_201606/Raghupati%20Raghav%20Raja%20Ram.mp3',
        duration: '4:20',
        cover: 'https://images.unsplash.com/photo-1598556885316-56a5242b3805?q=80&w=200&auto=format&fit=crop'
    }
];
