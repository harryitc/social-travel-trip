// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    initial: "m_20250411_care_history",
    type: "input",
    name: "moduleName",
    message: "What's your module's name (e.g: category)?",
  },
  {
    initial: "m_20250411_care_history",
    type: "input",
    name: "pgsqlDataTableName",
    message:
      "What's the name of your PostgreSQL data table you want to query?(e.g: sys_contact)",
  },
  {
    initial: ["care_history_id", "varchar"],
    type: "list",
    name: "idField",
    message:
      "Please enter the 'id' field of your entity - format (fieldName, dataType) (e.g., id, serial).",
  },
  {
    initial: [
      "item_id",
      "varchar",

      "interaction_time",
      "timestamp",

      "activity_type",
      "int",

      "data",
      "jsonb",

      "current_status",
      "varchar",

      "time_create",
      "timestamp",

      "time_update",
      "timestamp",

      "user_create",
      "varchar",

      "user_update",
      "varchar",
    ],
    type: "list",
    name: "entityAttributes",
    message:
      "Please enter the fields other than the 'id' field of your entity, specifying each field along with its data type. For example: name, varchar",
  },
  {
    initial: "../../result",
    type: "input",
    name: "nestjsOutputPath",
    message: "Enter Nestjs module outputPath (e.g: ../main-api/src/modules)?",
  },
  {
    initial: "../../result",
    type: "input",
    name: "angularOutputPath",
    message:
      "Enter Angular module outputPath (e.g: ../main-web/src/app/features)?",
  },
  {
    initial: "no",
    type: "input",
    name: "generateAxios",
    message: "Would you like to use Axios Httpclient (yes/no)?",
  },
  {
    initial: "no",
    type: "input",
    name: "enableORM",
    message: "Would you like to use TypeORM? (yes/no)",
  },
  {
    initial: "CONNECTION_STRING_DEFAULT",
    type: "input",
    name: "pgsqlConnectionString",
    message:
      "Enter PoolClient connection token (ex: CONNECTION_STRING_DEFAULT)?",
  },
  {
    initial: "TYPE_ORM_DATASOURCE_INJECT_TOKEN_MAIN_DATABASE",
    type: "input",
    name: "typeORMConnectionString",
    message:
      "Enter TYPEORM connection token (ex: TYPE_ORM_DATASOURCE_INJECT_TOKEN_MAIN_DATABASE)?",
  },
  {
    initial: [
      "Search_By_User_Input",
      "Delete_By_Id",
      "Create_One",
      "Update_One",
      "Filter_Modal",
      "Fullscreen_Detail",
      "Select_Row_In_List",
      // 'Quick_View',
      "Multi_Action_Delete",
    ],
    type: "multiselect",
    choices: [
      "Search_By_User_Input",
      "Delete_By_Id",
      "Create_One",
      "Update_One",
      "Filter_Modal",
      "Fullscreen_Detail",
      "Select_Row_In_List",
      "Quick_View",
      "Multi_Action_Delete",
    ],
    name: "featureToGenerate",
    message:
      "Choose feature you want to generate - Press spacebar to choose (default all)",
  },
  {
    initial: [""],
    type: "list",
    name: "searchFields",
    message: "Enter search field (ex: name, status)?",
  },
];
