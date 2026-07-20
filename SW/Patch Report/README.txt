

===================================
Interim Patch for Base Bug: 17301874
===================================

Date: Mar 25, 2014
----------------------------------
 Platform Patch for   : Windows 64 bit
 Product Patched      : Forms
 Product Version      : 11.1.2.2.0

Bugs Fixed by this patch:
-------------------------

17301874 - THERE SEEMS TO BE AN INFINITE LOOP IN VGS.DLL

Patch Prerequisites:
--------------------

1. For non-recommended patches, you must have the exact symptoms
   described in the bug.

2. Review and download the latest version of OPatch 11.1.x via bug 6880880.
   (opatch version 11.1.0.8.1 or higher)

   Oracle recommends that all customers be on the latest version of OPatch.
   Please review the following My Oracle Support note and follow the instructions
   to update to the latest version if needed:

   Note 224346.1 - Opatch - Where Can I Find the Latest Version of Opatch?
 
   For FMW Opatch usage, please refer the doc at :
   http://www.oracle.com/technology/software/products/ias/files/fmw_opatch.htm

3. Verify the OUI Inventory.

   OPatch needs access to a valid OUI inventory to apply patches.
   Validate the OUI inventory with the following command:

   opatch lsinventory

   If the command errors out, contact Oracle Support and work to validate
   and verify the inventory setup before proceeding.

4.  Confirm executables appear in your system PATH.

   The patching process will use the unzip and the opatch executables.  After
   sourcing the ORACLE_HOME environment, confirm both of these exist before
   continuing:

   - "which opatch"
   - "which unzip"

   If either of these executables do not show in the PATH, correct the problem
   before proceeding.

5.  Create a location for storing the unzipped patch. This location
    will be referred to later in the document as PATCH_TOP.

  
Patch Pre Install Instructions:
------------------------------

- Shut down of all services running from the ORACLE_HOME.
  Run command: %opmnctl stopall
  

Patch Install Instructions:
---------------------------

1. Unzip the patch zip file into the PATCH_TOP.D:\oracle\ofm\ofr\as1\OPatch

   unzip -d PATCH_TOP p17301874_111220_WINDOWSX64.zip
  
2. Set your current directory to the directory where the patch is located.

   cd PATCH_TOP/D:\oracle\ofm\ofr\as1\OPatch

3. Apply the patch.

  Use the following command to apply the patch to the ORACLE_HOME:

  opatch apply 

When OPatch starts, it will validate the patch and make sure there
are no conflicts with the software already installed in the ORACLE_HOME.
OPatch categorizes two types of conflicts:

  (a) Conflicts with a patch already applied to the ORACLE_HOME
  In this case, please stop the patch installation and contact
  Oracle Support Services.

  (b) Conflicts with subset patch already applied to the ORACLE_HOME
  In this case, please continue the install, as the new patch
  contains all the fixes from the existing patch in the ORACLE_HOME.
  The subset patch will automatically be rolled back prior to the
  installation of the new patch.



Patch Post Install Instructions:
--------------------------------

- Start all services running from the ORACLE_HOME.
  Run command: %opmnctl startall
   

Patch Deinstallation Instructions:
----------------------------------

1. Make sure to follow the same pre-install steps when deinstalling a patch.  
   This includes verifying the inventory and shutting down any services running from the 
   ORACLE_HOME / machine before rolling   the patch back.

2. Change to the directory where the patch was unzipped.
   cd PATCH_TOP/17301874

3. Run OPatch to deinstall the patch.
   opatch rollback -id 17301874
  

DISCLAIMER:
-----------
This one-off patch has only undergone basic unit testing
and it has not been through a complete test cycle generally
followed for a production patch set. Though the fix in this
one-off patch rectifies the bug, Oracle Corporation will not
be responsible for other issues that may arise due to this fix.
Oracle Corporation recommends to later upgrade to the next
production patch set, when available. Applying this PSE could
overwrite other one-off patches applied since the last
patch set. Customers need to make a request to Oracle Support
for a patch that includes those fixes as well as inform Oracle
Support about all the PSE installed when a SR is opened.
Please download, test and provide feedback as soon as possible
to assist in the timely resolution of this problem.



