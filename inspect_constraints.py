import psycopg2

conn = psycopg2.connect("dbname=PayEdu_db user=postgres password=Scotty237 host=localhost port=5432")
cur = conn.cursor()

print('=== pg_type entries for apprenant and etablissement ===')
cur.execute("SELECT typname, typtype, typcategory, typbasetype, typlen, typinput, typoutput FROM pg_type WHERE typname IN ('apprenant', 'etablissement')")
for row in cur.fetchall():
    print(row)

print('\n=== pg_enum labels for apprenant and etablissement ===')
cur.execute("SELECT t.typname, e.enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname IN ('apprenant', 'etablissement') ORDER BY t.typname, e.enumsortorder")
for row in cur.fetchall():
    print(row)

print('\n=== paiements column types ===')
cur.execute("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name='paiements' ORDER BY ordinal_position")
for row in cur.fetchall():
    print(row)

print('\n=== sample paiements rows ===')
cur.execute("SELECT apprenant_id::text, etablissement_id::text FROM paiements LIMIT 20")
for row in cur.fetchall():
    print(row)

print('\n=== invalid uuid candidate rows for apprenant_id ===')
cur.execute("SELECT apprenant_id::text FROM paiements WHERE apprenant_id IS NOT NULL AND NOT (apprenant_id::text ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$') LIMIT 20")
for row in cur.fetchall():
    print(row)

print('\n=== invalid uuid candidate rows for etablissement_id ===')
cur.execute("SELECT etablissement_id::text FROM paiements WHERE etablissement_id IS NOT NULL AND NOT (etablissement_id::text ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$') LIMIT 20")
for row in cur.fetchall():
    print(row)

cur.close()
conn.close()
