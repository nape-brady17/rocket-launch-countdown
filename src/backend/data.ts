// backend/data.js

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

export function getCountdownTime(launchDate: string | undefined): [number, number, number, number] {
  if (!launchDate) return [0, 0, 0, 0]; //there is no launch date

  const now = new Date().getTime();
  const launchTime = new Date(launchDate).getTime();
  const diff = launchTime - now;

  if (diff <= 0 ) return [0, 0, 0, 0]; // the launch already occured

  const seconds = Math.floor(diff / 1000);
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const mins = Math.floor((seconds % 3600) /60);
  const secs = seconds % 60;

  return [days, hours, mins, secs];
}
