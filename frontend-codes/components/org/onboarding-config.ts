import {
  OrgMission,
  OperatingModel,
  CollaborationMode,
  OrgType,
} from "@prisma/client";

export const OrgTypeConfig: Record<
  OrgType,
  {
    missions: OrgMission[];
    operatingModels: OperatingModel[];
    collaborationModes: CollaborationMode[];
  }
> = {
  Fellowship_Program: {
    missions: ["Talent_Development", "Skill_Training", "Community_Building"],
    operatingModels: ["Cohort_Based", "Apprenticeship_Model", "Hybrid_Model"],
    collaborationModes: ["Individual_First", "Team_Based", "Hybrid_Collaboration"],
  },

  Startup_Company: {
    missions: ["Product_Incubation", "Talent_Development", "Hackathons_And_Competitions"],
    operatingModels: ["Project_Based", "Apprenticeship_Model"],
    collaborationModes: ["Team_Based", "Hybrid_Collaboration"],
  },

  Tech_Community: {
    missions: ["Community_Building", "Open_Source_Contribution", "Hackathons_And_Competitions"],
    operatingModels: ["Community_Led", "Project_Based"],
    collaborationModes: ["Hybrid_Collaboration"],
  },

  Training_Academy: {
    missions: ["Skill_Training", "Talent_Development"],
    operatingModels: ["Cohort_Based", "Project_Based"],
    collaborationModes: ["Individual_First", "Team_Based"],
  },

  Talent_Accelerator: {
    missions: ["Talent_Development", "Hiring_And_Placement_Pipeline"],
    operatingModels: ["Cohort_Based", "Apprenticeship_Model"],
    collaborationModes: ["Team_Based"],
  },

  Open_Source_Community: {
    missions: ["Open_Source_Contribution", "Community_Building"],
    operatingModels: ["Community_Led", "Project_Based"],
    collaborationModes: ["Hybrid_Collaboration"],
  },

  Corporate_Learning_Team: {
    missions: ["Internal_Team_UpSkilling", "Skill_Training"],
    operatingModels: ["Cohort_Based", "Hybrid_Model"],
    collaborationModes: ["Individual_First", "Team_Based"],
  },

  University_Department: {
    missions: ["Research_And_Education", "Skill_Training"],
    operatingModels: ["Cohort_Based"],
    collaborationModes: ["Individual_First"],
  },

  Nonprofit_Initiative: {
    missions: ["Community_Building", "Talent_Development"],
    operatingModels: ["Community_Led", "Cohort_Based"],
    collaborationModes: ["Hybrid_Collaboration"],
  },

  Bootcamp_Provider: {
    missions: ["Skill_Training", "Talent_Development", "Hiring_And_Placement_Pipeline"],
    operatingModels: ["Cohort_Based"],
    collaborationModes: ["Team_Based"],
  },

  Other: {
    missions: ["Community_Building", "Talent_Development"],
    operatingModels: ["Hybrid_Model"],
    collaborationModes: ["Hybrid_Collaboration"],
  },
};

export const formatEnum = (str: string) =>
  str.replace(/_/g, " ");