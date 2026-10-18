from argon2 import PasswordHasher
ph = PasswordHasher()
h  = ph.hash("wqzCogXDjcKZZ8OvZxgYDsKWw4Ulw6TDn2tYFcOqwqtXwqspwrpaOcKKwrkcw5su")

print(h)