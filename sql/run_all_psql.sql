-- Run-all driver (psql)
--
-- This file uses psql meta-commands (\i) to include other SQL files.
-- It is intended for the PostgreSQL `psql` CLI.
--
-- If you're running scripts inside DBeaver, \i may not be supported.
-- In that case, run these files manually in this order:
--   1) module_2.sql
--   2) population.sql
--   3) module_3_fraud_detection.sql
--   4) module_3_high_account_balance.sql
--   5) module_3_inactive_account_followup.sql
--   6) module_4.sql

\echo '== Module 2: schema =='
\i sql/module_2.sql

\echo '== Seed data =='
\i sql/population.sql

\echo '== Module 3: fraud detection view =='
\i sql/module_3_fraud_detection.sql

\echo '== Module 3: high account balance recommendations =='
\i sql/module_3_high_account_balance.sql

\echo '== Module 3: inactive account follow-up =='
\i sql/module_3_inactive_account_followup.sql

\echo '== Module 4: joins/queries =='
\i sql/module_4.sql

\echo '== Done =='
