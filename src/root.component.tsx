import {useEffect, useState} from 'react';

// Imports for icons
import {LuAlertOctagon} from 'react-icons/lu';
import {ImMobile} from 'react-icons/im';
import {IoMdSend} from 'react-icons/io';

// Import for style
import './style/style.css';

// Import from .json file for backend endpoints
import configEndpoints from './assets/configurationEndpoints/configuration.json';

export default function Root() {
  // To open or close alarm modal, changing alarm modal id
  const [alarmModalId, setAlarmModalId] = useState('alarmModal_unclicked');
  // To show the "Show All" button or the "Show Less" button
  const [allAlarms, setAllAlarms] = useState(true);
  // For the search bar
  const [searchInput, setSearchInput] = useState('');

  // When the user clicks on closing cross, close the alarm modal
  const closeAlarmModal = () => {
    setAlarmModalId('alarmModal_unclicked');
    // Now the EventListener is called to communicate the closure of the alarm modal
    window.dispatchEvent(new CustomEvent('closeAlarmModal'));
  };

  // For the search bar
  const handleChangeSearchBar = e => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  /* To update the alarm table. It is used both when the page loads and
  when the "Show All" button or the "Show Less" button is clicked. */
  const updateAlarmTable = endpointBE => {
    // To show the "Show All" button or the "Show Less" button
    setAllAlarms(!allAlarms);

    // Read the data from backend to complete and configure the alarm table
    fetch(endpointBE)
      .then(response => response.json())
      .then(jsonData => {
        // jsonData is parsed json object received from url

        const alarmHeader: Array<string> = jsonData.alarmHeader;
        // If the json object received from url contains data
        if (alarmHeader.length > 0) {
          // To complete the alarm table header
          const alarmTable = document.getElementById('alarmTable');
          alarmTable.innerHTML = '';
          const tr = document.createElement('tr');
          for (let i = 0; i < alarmHeader.length; i++) {
            const th = document.createElement('th');
            th.innerHTML = alarmHeader[i];
            tr.appendChild(th);
          }
          alarmTable.appendChild(tr);

          // To complete the alarm table list
          const alarmList: Array<Array<string>> = jsonData.alarmList;
          for (let i = 0; i < alarmList.length; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < alarmList[i].length; j++) {
              const td = document.createElement('td');
              td.innerHTML = alarmList[i][j];
              tr.appendChild(td);
            }
            alarmTable.appendChild(tr);
          }
        }
      })
      .catch(error => {
        // handle errors here
        console.error(error);
      });
  };

  useEffect(() => {
    // Listener to set the alarm modal id correctly to open the alarm modal
    const handleOpenAlarmModal = () => {
      setAlarmModalId('alarmModal_clicked');
    };
    window.addEventListener('openAlarmModal', handleOpenAlarmModal);

    // To read the data from backend to complete and configure the alarm table (with number of alarms limited to 5)
    updateAlarmTable(configEndpoints.get5AlarmsList);

    return () => {
      window.removeEventListener('openAlarmModal', handleOpenAlarmModal);
    };
  }, []);

  return (
    <>
      <div id={alarmModalId}>
        <div id="alarmModalContent">
          <span
            id="closingCross"
            data-testid="closingCross"
            onClick={closeAlarmModal}
          >
            &times;
          </span>
          <div id="alarmTitleDiv" data-testid="alarmTitleDiv">
            <LuAlertOctagon id="alertOctagonIcon" /> Alarms{' '}
            <ImMobile id="mobileIcon" />
          </div>
          <div id="searchBarDiv" data-testid="searchBarDiv">
            <input
              id="searchBar"
              type="search"
              placeholder="Search..."
              onChange={handleChangeSearchBar}
              value={searchInput}
            />
            <IoMdSend id="sendIcon" />
          </div>
          <div id="alarmTableDiv">
            <table id="alarmTable" data-testid="alarmTable"></table>
          </div>
          {allAlarms ? (
            <button
              id="showLessAlarmsButton"
              onClick={() => updateAlarmTable(configEndpoints.get5AlarmsList)}
            >
              Show Less
            </button>
          ) : (
            <button
              id="showAllAlarmsButton"
              onClick={() => updateAlarmTable(configEndpoints.getAllAlarmsList)}
            >
              Show All
            </button>
          )}
        </div>
      </div>
    </>
  );
}
