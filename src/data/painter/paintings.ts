// Static painting data - KISS approach: No API calls, no user input, secure
export interface Painting {
  id: string;
  title: string;
  artist?: string;
  filename: string;
}

export const PAINTINGS: readonly Painting[] = [
  { id: '1', title: 'Salvator Mundo', artist: 'Leonardo da Vinci', filename: '1. Salvator Mundo.webp' },
  { id: '2', title: 'Interchange', artist: 'Willem de Kooning', filename: '2. Interchange by Willem de Kooning.webp' },
  { id: '3', title: 'The Card Players', artist: 'Paul Cézanne', filename: '3. The Card Players by Paul Cézanne.webp' },
  { id: '4', title: 'Nafea Faa Ipoipo (When Will You Marry)', artist: 'Paul Gauguin', filename: '4. Nafea Faa Ipoipo (When Will You Marry) by Paul Gauguin.webp' },
  { id: '5', title: 'Number 17A', artist: 'Jackson Pollock', filename: '5. Number 17A by Jackson Pollock.webp' },
  { id: '6', title: 'The Standard Bearer', artist: 'Rembrandt', filename: '6. The Standard Bearer by Rembrandt.webp' },
  { id: '7', title: 'Shot Sage Blue Marilyn', artist: 'Andy Warhol', filename: '7. Shot Sage Blue Marilyn by Andy Warhol.webp' },
  { id: '8', title: 'No. 6 (Violet, Green and Red)', artist: 'Mark Rothko', filename: '8. No. 6 (Violet, Green and Red) by Mark Rothko.webp' },
  { id: '9', title: 'Wasserschlangen II (Water Serpents II)', artist: 'Gustav Klimt', filename: '9. Wasserschlangen II (Water Serpents II) by Gustav Klimt.webp' },
  { id: '10', title: 'Pendant portraits of Maerten Soolmans and Oopjen Coppit', artist: 'Rembrandt', filename: '10. Pendant portraits of Maerten Soolmans and Oopjen Coppit by Rembrandt.webp' },
  { id: '11', title: 'Les Femmes d\'Alger (Version O)', artist: 'Pablo Picasso', filename: '11. Les Femmes d\'Alger (Version O) by Pablo Picasso.webp' },
  { id: '12', title: 'Nu couché', artist: 'Amedeo Modigliani', filename: '12. Nu couchÃ© by Amedeo Modigliani.webp' },
  { id: '13', title: 'Otahi', artist: 'Paul Gauguin', filename: '13. Otahi by Paul Gauguin.webp' },
  { id: '14', title: 'Le Rêve', artist: 'Pablo Picasso', filename: '14. Le RÃªve by Pablo Picasso.webp' },
  { id: '15', title: 'Portrait of Adele Bloch-Bauer II', artist: 'Gustav Klimt', filename: '15. Portrait of Adele Bloch-Bauer II by Gustav Klimt.webp' },
  { id: '16', title: 'Les Poseuses, Ensemble (Petite version)', artist: 'Georges Seurat', filename: '16. Les Poseuses, Ensemble (Petite version) by Georges Seurat.webp' },
  { id: '17', title: 'Three Studies of Lucian Freud', artist: 'Francis Bacon', filename: '17. Three Studies of Lucian Freud by Francis Bacon.webp' },
  { id: '18', title: 'Twelve Landscape Screens', artist: 'Qi Baishi', filename: '18. Twelve Landscape Screens by Qi Baishi.webp' },
  { id: '19', title: 'No. 5, 1948', artist: 'Jackson Pollock', filename: '19. No. 5, 1948 by Jackson Pollock.webp' },
  { id: '20', title: 'Femme à la montre', artist: 'Pablo Picasso', filename: '20. Femme Ã  la montre by Pablo Picasso.webp' },
  { id: '21', title: 'La Montagne Sainte-Victoire', artist: 'Paul Cézanne', filename: '21. La Montagne Sainte-Victoire by Paul CÃ©zanne.webp' },
  { id: '22', title: 'Portrait of Adele Bloch-Bauer I', artist: 'Gustav Klimt', filename: '23. Portrait of Adele Bloch by Bauer I.webp' },
  { id: '23', title: 'The Scream', artist: 'Edvard Munch', filename: '24. The Scream by Edvard Munch.webp' },
  { id: '24', title: 'Flag', artist: 'Jasper Johns', filename: '25. Flag by Jaspepe Johns.webp' },
] as const;