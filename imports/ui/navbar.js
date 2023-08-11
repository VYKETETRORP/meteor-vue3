export default [
  {
    title: 'Dashboard',
    route: { name: 'Dashboard' },
    icon: 'fa-solid fa-gauge',
  },
  
  // {
  //   title: "Report",
  //   route: { name: "Report" },
  //   icon: "fa-solid fa-file-contract",
  // },

 
  {
    title: "Employee",
    route: { name: "Employee" },
    icon:"fa-solid fa-address-card",
  },
  {
    title: "Attendance",
    route: { name: "Attendance" },
    icon:"fa-solid fa-file-circle-check"

  },

  //admin-setting
  {
    title: "Admin Setting",
    icon: "fa-solid fa-user-cog",
    group: "admin",
    route: { name: "AdminSetting", params: { activeCom: "profile" } },
    children: [
     
      {
        title: "Profile",
        route: { name: "AdminSetting", params: { activeCom: "profile" } },
        icon: 'fa-solid fa-users',
        group: "admin",
      },
      {
        title: "Branch",
        route: { name: "AdminSetting", params: { activeCom: "branch" } },
        icon: 'fa-solid fa-code-branch',

        group: "admin",
      },
      // {
      //   title: "Branch",
      //   route: { name: "Branch" },
      //   icon: "fa-solid fa-code-branch",
      // },
      {
        title: "Department",
        route: { name: "AdminSetting", params: { activeCom: "department" } },
        icon: "fa-solid fa-building-user",
        group: "admin",
      },
      {
        title: "Position",
        route: { name: "AdminSetting", params: { activeCom: "position" } },
        icon: "fa-solid fa-hands-holding-circle",
        group: "admin",
      },
      {
        title: "Employee Type",
        route: { name: "AdminSetting", params: { activeCom: "employee_type" } },
        icon: "fa-solid fa-person-circle-exclamation",
        group: "admin",
      },
      {
        title: "Leave",
        route: { name: "AdminSetting", params: { activeCom: "leave" } },
        icon: "fa-solid fa-arrow-right-from-bracket",
        group: "admin",
      },
      
      // {
      //   title: "Employee",
      //   route: { name: "AdminSetting", params: { activeCom: "employee" } },
      //   group: "admin",
      //   icon: "fa-solid fa-users",
      //   // roles: ['admin'],
      // },
      // {
      //   title: 'Employee',
      //   route: { name: 'AdminSetting', params: { activeCom: 'employee' } },
      //   group: 'admin',
      //   icon: 'fa-solid fa-users',
      //   // roles: ['admin'],
      // },
      {
        title: 'User',
        route: { name: 'AdminSetting', params: { activeCom: 'user' } },
        group: 'admin',
        icon: 'fa-solid fa-users',
        // roles: ['admin'],
      },
    ],
  },
]
