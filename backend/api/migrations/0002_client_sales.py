# Generated by Django 5.1.4 on 2024-12-10 16:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='sales',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
    ]
