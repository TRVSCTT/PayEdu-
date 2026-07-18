import psycopg2

conn = psycopg2.connect("dbname=PayEdu_db user=postgres password=Scotty237 host=localhost port=5432")
cur = conn.cursor()

print('COUNT:')
cur.execute("SELECT count(*) FROM paiements")
print(cur.fetchone())

print('\nCOLUMN TYPES:')
cur.execute("SELECT column_name, data_type, udt_name FROM information_schema.columns WHERE table_name='paiements' ORDER BY ordinal_position")
for row in cur.fetchall():
    print(row)

print('\nDDL:')
cur.execute("SELECT pg_get_expr(adbin, adrelid), adsrc, adname FROM pg_attrdef WHERE adrelid='paiements'::regclass")
for row in cur.fetchall():
    print(row)

print('\nFK constraints:')
cur.execute("SELECT conname, pg_get_constraintdef(c.oid) FROM pg_constraint c JOIN pg_class t ON c.conrelid=t.oid WHERE t.relname='paiements' AND c.contype='f';")
for row in cur.fetchall():
    print(row)

cur.close()
conn.close()
