export function getDynamicProfileDefaults(roleCategory: string) {
  switch (roleCategory) {
    case 'developer':
      return {
        bio: 'Passionate software engineer focused on building scalable backend systems and robust applications.',
        skills: ['TypeScript', 'Node.js', 'React', 'System Design'],
      };
    case 'designer':
      return {
        bio: 'Creative product designer dedicated to crafting intuitive, user-centric interfaces and experiences.',
        skills: ['UI/UX', 'Figma', 'Prototyping', 'User Research'],
      };
    case 'researcher':
      return {
        bio: 'Detail-oriented researcher focused on data analysis, validating hypotheses, and uncovering user insights.',
        skills: ['Data Analysis', 'Surveys', 'Qualitative Research', 'Reporting'],
      };
    case 'expert':
      return {
        bio: 'Domain expert leveraging years of industry experience to guide strategic decision-making and product direction.',
        skills: ['Strategy', 'Consulting', 'Industry Knowledge', 'Leadership'],
      };
    case 'ai':
      return {
        bio: 'AI enthusiast and machine learning practitioner building intelligent models for real-world problem solving.',
        skills: ['Machine Learning', 'Python', 'Data Science', 'LLMs'],
      };
    default:
      return {
        bio: 'Community builder & innovator driving positive change and collaborative problem solving.',
        skills: ['Collaboration', 'Problem Solving', 'Communication', 'Ideation'],
      };
  }
}
