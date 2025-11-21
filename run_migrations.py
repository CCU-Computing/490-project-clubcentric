import subprocess
import os

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(script_dir, 'backend')
os.chdir(backend_dir)
print('Running makemigrations for analytics and networking...')
result = subprocess.run(['python', 'manage.py', 'makemigrations', 'analytics', 'networking'], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print('STDERR:', result.stderr)
print('Return code:', result.returncode)

if result.returncode == 0:
    print('\nRunning migrate...')
    result2 = subprocess.run(['python', 'manage.py', 'migrate'], capture_output=True, text=True)
    print(result2.stdout)
    if result2.stderr:
        print('STDERR:', result2.stderr)
    print('Return code:', result2.returncode)

