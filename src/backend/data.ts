// src/api/launches.js

export async function fetchUpcomingLaunches() {
  try {
    const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?location__ids=27,12&status__ids=1,8', {
      mode: 'cors',
    });
    const data: any = await res.json();
    console.log(data.results);
    return data.results;
  } catch (e) {
    console.error('Failed to fetch launches:', e);
    return [];
  }
}
