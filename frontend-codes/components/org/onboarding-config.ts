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
  Bootcamp_Or_Academy: {
    missions: [OrgMission.Technical_Upskilling, OrgMission.Workforce_Readiness],
    operatingModels: [OperatingModel.Strict_Cohort_Based, OperatingModel.Apprenticeship_Driven],
    collaborationModes: [CollaborationMode.Squad_Based, CollaborationMode.Fluid_Hybrid],
  },

  University_Or_School: {
    missions: [OrgMission.Academic_Research, OrgMission.Technical_Upskilling],
    operatingModels: [OperatingModel.Strict_Cohort_Based],
    collaborationModes: [CollaborationMode.Solo_Execution, CollaborationMode.Squad_Based],
  },

  Student_Chapter: {
    missions: [OrgMission.Ecosystem_Building, OrgMission.Technical_Upskilling, OrgMission.Open_Innovation_And_Hackathons],
    operatingModels: [OperatingModel.Community_Led_Mentorship, OperatingModel.Event_Driven_Sprints],
    collaborationModes: [CollaborationMode.Squad_Based, CollaborationMode.Open_Crowdsourced],
  },

  Tech_Community: {
    missions: [OrgMission.Ecosystem_Building, OrgMission.Open_Innovation_And_Hackathons],
    operatingModels: [OperatingModel.Community_Led_Mentorship, OperatingModel.Event_Driven_Sprints],
    collaborationModes: [CollaborationMode.Open_Crowdsourced, CollaborationMode.Fluid_Hybrid],
  },

  Open_Source_Foundation: {
    missions: [OrgMission.Ecosystem_Building, OrgMission.Product_Incubation],
    operatingModels: [OperatingModel.Community_Led_Mentorship, OperatingModel.Self_Paced_Continuous],
    collaborationModes: [CollaborationMode.Open_Crowdsourced],
  },

  Startup_Incubator: {
    missions: [OrgMission.Product_Incubation, OrgMission.Workforce_Readiness],
    operatingModels: [OperatingModel.Apprenticeship_Driven, OperatingModel.Strict_Cohort_Based],
    collaborationModes: [CollaborationMode.Squad_Based],
  },

  Corporate_L_And_D: {
    missions: [OrgMission.Internal_Corporate_Training, OrgMission.Technical_Upskilling],
    operatingModels: [OperatingModel.Strict_Cohort_Based, OperatingModel.Self_Paced_Continuous],
    collaborationModes: [CollaborationMode.Solo_Execution, CollaborationMode.Squad_Based],
  },

  Nonprofit_Initiative: {
    missions: [OrgMission.Ecosystem_Building, OrgMission.Technical_Upskilling],
    operatingModels: [OperatingModel.Community_Led_Mentorship, OperatingModel.Self_Paced_Continuous],
    collaborationModes: [CollaborationMode.Open_Crowdsourced, CollaborationMode.Fluid_Hybrid],
  },

  Government_Program: {
    missions: [OrgMission.Ecosystem_Building, OrgMission.Workforce_Readiness],
    operatingModels: [OperatingModel.Strict_Cohort_Based, OperatingModel.Event_Driven_Sprints],
    collaborationModes: [CollaborationMode.Squad_Based],
  },

  Independent_Fellowship: {
    missions: [OrgMission.Technical_Upskilling, OrgMission.Workforce_Readiness, OrgMission.Product_Incubation],
    operatingModels: [OperatingModel.Apprenticeship_Driven, OperatingModel.Strict_Cohort_Based],
    collaborationModes: [CollaborationMode.Squad_Based],
  },

  Other: {
    missions: [OrgMission.Ecosystem_Building],
    operatingModels: [OperatingModel.Self_Paced_Continuous],
    collaborationModes: [CollaborationMode.Fluid_Hybrid],
  },
};

/**
 * Utility to make enum strings readable for the UI
 * e.g., "Bootcamp_Or_Academy" -> "Bootcamp Or Academy"
 */
export const formatEnum = (str: string) => str.replace(/_/g, " ");