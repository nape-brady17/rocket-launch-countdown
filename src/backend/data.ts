// src/api/launches.js

export interface Launch {   // this interface can and should be expanded to include more information down the road
    name: string;
    net: string; 
}

// both of the calls limit the number of responses to 5 for simpler handling for now (this can be exapanded later)
// these links uses lldev for development (do not contain rate limits), will need to switch to ll for development

export async function fetchUpcomingLaunches() {
  try {
    const res = await fetch('https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?location__ids=27,12&status__ids=1,8&limit=5', {
      mode: 'cors',
    });
    const data: any = await res.json();

    const upcomingLaunches: Launch[] = data.results.map((launch: any) => ({
        name: launch.name,
        net: launch.net,
    }));

    console.log(upcomingLaunches);
    return upcomingLaunches;
  } catch (e) {
    console.error('Failed to fetch launches:', e);
    return [];
  }
}

export async function fetchPreviousLaunches() {
  try {
    const res = await fetch('https://lldev.thespacedevs.com/2.2.0/launch/previous/?location__ids=27,12&limit=5', {
      mode: 'cors',
    });
    const data: any = await res.json();

    const previousLaunches: Launch[] = data.results.map((launch: any) => ({
        name: launch.name,
        net: launch.net,
    }));

    console.log(previousLaunches);
    return previousLaunches;
  } catch (e) {
    console.error('Failed to fetch launches:', e);
    return [];
  }
}
