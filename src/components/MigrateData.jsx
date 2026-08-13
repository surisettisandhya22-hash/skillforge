import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

// Import all local data
import mcqData from '../assignmentsData/mcqData';
import interviewData from '../interviewData/interviewData';
import notesData from '../notesData/notesData';
import projectsData from '../projectsData/projectsData';
import roadmapData from '../roadmapData/roadmapData';
import skillsData from '../skillsData/skillsData';

const MigrateData = () => {
  const [status, setStatus] = useState('Idle');

  const handleMigrate = async () => {
    setStatus('Migrating...');
    try {
      // 1. Migrate mcqData
      for (const [category, questions] of Object.entries(mcqData)) {
        await setDoc(doc(db, 'mcqs', category), { questions });
      }

      // 2. Migrate interviewData
      if (Array.isArray(interviewData)) {
        for (let i = 0; i < interviewData.length; i++) {
          const item = interviewData[i];
          await setDoc(doc(db, 'interviews', item.id ? item.id.toString() : `item_${i}`), item);
        }
      } else {
        await setDoc(doc(db, 'interviews', 'data'), interviewData);
      }

      // 3. Migrate notesData
      if (Array.isArray(notesData)) {
        for (let i = 0; i < notesData.length; i++) {
           const item = notesData[i];
           await setDoc(doc(db, 'notes', item.id ? item.id.toString() : `item_${i}`), item);
        }
      } else {
          await setDoc(doc(db, 'notes', 'data'), notesData);
      }

      // 4. Removed profileData migration

      // 5. Migrate projectsData
      if (Array.isArray(projectsData)) {
         for (let i = 0; i < projectsData.length; i++) {
            const item = projectsData[i];
            await setDoc(doc(db, 'projects', item.id ? item.id.toString() : `item_${i}`), item);
         }
      } else {
         await setDoc(doc(db, 'projects', 'data'), projectsData);
      }

      // 6. Migrate roadmapData
      if (Array.isArray(roadmapData)) {
         for (let i = 0; i < roadmapData.length; i++) {
            const item = roadmapData[i];
            await setDoc(doc(db, 'roadmaps', item.id ? item.id.toString() : `item_${i}`), item);
         }
      } else {
         await setDoc(doc(db, 'roadmaps', 'data'), roadmapData);
      }

      // 7. Migrate skillsData
      if (Array.isArray(skillsData)) {
         for (let i = 0; i < skillsData.length; i++) {
            const item = skillsData[i];
            await setDoc(doc(db, 'skills', item.id ? item.id.toString() : `item_${i}`), item);
         }
      } else {
         await setDoc(doc(db, 'skills', 'data'), skillsData);
      }

      setStatus('Migration Complete! Check Firebase Console.');
    } catch (error) {
      console.error(error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Data Migration Tool</h2>
      <button onClick={handleMigrate} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Run Migration
      </button>
      <p>Status: {status}</p>
    </div>
  );
};

export default MigrateData;
